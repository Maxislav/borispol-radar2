import { IncomingMessage } from "http";

const http = require("http");
const DomParser = require('dom-parser');

function httpGet<T>(opt: {path: string, host: string}, count = 0) {
    return new Promise((res: any, rej: any) => {
        http.get({
            // path: url,
            path: opt.path,
            host: opt.host,
            headers: {
                Host: 'meteoinfo.by',
                Referer: `http://${opt.host}${opt.path}`,
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
            }
        }, (resp: IncomingMessage) => {
            const chunks: Uint8Array[] = [];
            resp.on('data', (chunk: Uint8Array) => {
                chunks.push(chunk)
            });

            resp.on('end', () => {
                const response = Buffer.concat(chunks);
                if (!response.length) {
                    return rej(new Error('empty body'))
                }
                res(response)
            });
            resp.on('error', function (err: Error) {
                rej(err)
            });
        })
    })
}

function getUkbb(res) {
    return httpGet({
        host: 'meteoinfo.by',
        path: '/radar/?q=UKBB&t=00'
    })
        .then((data: any) => {
            const body = data.toString();
            const parser = new DomParser();
            const xmlDoc = parser.parseFromString(body);
            const rdr = xmlDoc.getElementById('rdr');
            if (!rdr) {
                return Promise.reject(new Error('!rdr'))
            }
            let imgUrl = rdr.getElementsByTagName('img')[0]
                .getAttribute('src');
            return imgUrl.replace(/^\.\//, '');
        })
        .then((imgUrl: string) => {
            //return httpGet(`http://meteoinfo.by/radar/${imgUrl}`)
            return httpGet({
                host: 'meteoinfo.by',
                path: `/radar/${imgUrl}`
            })
        })
        .then(response => {
            res.end(response)
        })
        .catch(err => {
            return Promise.reject(new Error(err))
        })
}

const timeoutPromise = () => {
    return new Promise((res) => {
        setTimeout(() => {
            res()
        }, 500)
    })
};

export function borispolukbb(req: any, res: any, next: any, count = 25) {

    const ressss = res;
    res.header("Access-Control-Allow-Origin", "*");
    getUkbb(res)

        .catch((err: any) => {
            console.error('borispolukbb err 2 -> ', count, err);
            if (count) {
                count--;
                return timeoutPromise()
                    .then(() => {
                        return borispolukbb(req, res, next, count)
                    })
            }
            ressss.end()
        })

}
