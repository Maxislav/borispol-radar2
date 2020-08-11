"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const DomParser = require('dom-parser');
function httpGet(opt, count = 0) {
    return new Promise((res, rej) => {
        http.get({
            // path: url,
            path: opt.path,
            host: opt.host,
            headers: {
                Host: 'meteoinfo.by',
                Referer: `http://${opt.host}${opt.path}`,
            }
        }, (resp) => {
            const chunks = [];
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
            resp.on('end', () => {
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
    return httpGet({
        host: 'meteoinfo.by',
        path: '/radar/?q=UKBB&t=00'
    })
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
        //return httpGet(`http://meteoinfo.by/radar/${imgUrl}`)
        return httpGet({
            host: 'meteoinfo.by',
            path: `/radar/${imgUrl}`
        });
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
}
exports.borispolukbb = borispolukbb;
//# sourceMappingURL=borispolukbb.js.map