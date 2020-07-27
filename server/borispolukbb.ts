const http = require("http");
const DomParser = require('dom-parser');

function httpGet(url) {
    return new Promise((res, rej) => {
        http.get(url, (resp) => {
            const chunks = [];
            resp.on('data', (chunk) => {
                chunks.push(chunk)
            });

            resp.on('end', () => {
                res(Buffer.concat(chunks))
            });
            resp.on('error', function (err) {
                rej(err)
            });
        })
    })
}


export function borispolukbb (req: any, res: any, next: any) {
    httpGet('http://meteoinfo.by/radar/?q=UKBB&t=0')
        .then((data: any) => {
            const body = data.toString();
            const parser = new DomParser();
            const xmlDoc = parser.parseFromString(body);
            const rdr = xmlDoc.getElementById('rdr');
            if (!rdr) {
                return res.end();
            }
            let imgUrl = rdr.getElementsByTagName('img')[0]
                .getAttribute('src');
            imgUrl = imgUrl.replace(/^\.\//, '');
            let opt = {
                port: 80,
                hostname: 'meteoinfo.by',
                method: 'GET',
                path: '/radar/' + imgUrl
                // headers: req.headers
            };
            res.header("Access-Control-Allow-Origin", "*");
            const proxyRequest = http.request(opt);
            proxyRequest.on('response', function (proxyResponse: any) {
                proxyResponse.on('data', function (chunk: any) {
                    res.write(chunk, 'binary');
                });
                proxyResponse.on('end', function () {
                    res.end();
                });
                //proxyResponse.writeHead("Access-Control-Allow-Origin", "http://178.62.44.54");
                res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
                // res.writeHead("Access-Control-Allow-Origin: http://178.62.44.54");
                // res.header("Access-Control-Allow-Origin", "http://178.62.44.54");
            });
            proxyRequest.on('error', function (err: any) {
                res.statusCode = 204;
                res.end('No connect');
            });
            req.on('data', function (chunk: any) {
                proxyRequest.write(chunk, 'binary');
            });
            req.on('end', function () {
                proxyRequest.end();
            });
        })


    //http://meteoinfo.by/radar/UKBB/UKBB_latest.png?v=288

};

