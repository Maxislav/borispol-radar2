import { IncomingMessage } from "http";

const http = require("http");
const https = require('https');
const DomParser = require('dom-parser');
function httpGet<T>(url: string, count = 0) {
    return new Promise((res: any, rej: any) => {
        https.get(url, (resp: IncomingMessage) => {
            const chunks: Uint8Array[] = [];
            resp.on('data', (chunk: Uint8Array) => {
                chunks.push(chunk)
            });

            resp.on('end', () => {
                url;
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
    return httpGet('https://meteoinfo.by/radar/?q=UKBB&t=0')
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
            return httpGet(`https://meteoinfo.by/radar/${imgUrl}`)
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
            res(true)
        }, 500)
    })
};

export function borispolukbb(req: any, res: any, next: any, count = 25) {

    const ressss = res;
    res.header("Access-Control-Allow-Origin", "*");
    getUkbb(res)

        .catch((err: any) => {
            console.error('borispolukbb err 2 -> ',count, err);
            if (count) {
                count--;
               return  timeoutPromise()
                    .then(()=>{
                       return  borispolukbb(req, res, next, count)
                    })
            }
            ressss.end()
        })

}
