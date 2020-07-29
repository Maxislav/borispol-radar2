"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const DomParser = require('dom-parser');
console.log('olooo');
function httpGet(url, count = 0) {
    return new Promise((res, rej) => {
        http.get(url, (resp) => {
            const chunks = [];
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
            resp.on('end', () => {
                url;
                const response = Buffer.concat(chunks);
                if (!response.length) {
                    return rej(new Error('empty body'));
                }
                res(response);
            });
            resp.on('error', function (err) {
                rej(err);
            });
        });
    });
}
function getUkbb(res) {
    return httpGet('http://meteoinfo.by/radar/?q=UKBB&t=0')
        .then((data) => {
        const body = data.toString();
        const parser = new DomParser();
        const xmlDoc = parser.parseFromString(body);
        const rdr = xmlDoc.getElementById('rdr');
        if (!rdr) {
            return Promise.reject(new Error('!rdr'));
        }
        let imgUrl = rdr.getElementsByTagName('img')[0]
            .getAttribute('src');
        return imgUrl.replace(/^\.\//, '');
    })
        .then((imgUrl) => {
        return httpGet(`http://meteoinfo.by/radar/${imgUrl}`);
    })
        .then(response => {
        res.end(response);
    })
        .catch(err => {
        return Promise.reject(new Error(err));
    });
}
const timeoutPromise = () => {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, 500);
    });
};
function borispolukbb(req, res, next, count = 25) {
    const ressss = res;
    res.header("Access-Control-Allow-Origin", "*");
    getUkbb(res)
        .catch((err) => {
        console.error('borispolukbb err 2 -> ', count, err);
        if (count) {
            count--;
            return timeoutPromise()
                .then(() => {
                return borispolukbb(req, res, next, count);
            });
        }
        ressss.end();
    });
    /* httpGet('http://meteoinfo.by/radar/?q=UKBB&t=0')
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
             res.header("Access-Control-Allow-Origin", "*");
             httpGet(`http://meteoinfo.by/radar/${imgUrl}`)
                 .then((data: Buffer) => {
                     console.log('buf.length -> ', data.length);
                     res.end(data)
                 })
                 .catch((err: Error) => {
                     console.error('borispolukbb err 2 -> ', err);
                     res.end(err)
                 })

         })
         .catch((err: Error) => {
             console.error('borispolukbb err -> ', err);
         })
 */
    //http://meteoinfo.by/radar/UKBB/UKBB_latest.png?v=288
}
exports.borispolukbb = borispolukbb;
;
//# sourceMappingURL=borispolukbb.js.map