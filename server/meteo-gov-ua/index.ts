import {Request, Response} from 'express-serve-static-core';
import https from 'https';

const httpGet = () : Promise<Buffer> => {
    return new Promise((res: any, rej: any) => {
        const options = {
           //  port: 80,
            host: 'meteo.gov.ua',
            path: '/ua/33345/radar/',
            method: 'GET',
        };
        const proxyRequest = https.request(options);
        const chunks: Buffer[] = [];
        proxyRequest.on('response', function(proxyResponse) {
            proxyResponse.on('data', function(chunk: Buffer) {
                chunks.push(chunk)
            });
            proxyResponse.on('end', function() {
                // res.send(Buffer.concat(chunks))
                res(Buffer.concat(chunks))
            });
        });
        proxyRequest.on('error', function(err) {
            console.error('proxyOpenRain history err3 ->'.red, err);
            rej(err)
        });
        proxyRequest.end();
    })
}

export const meteoGovUa = async (req: Request, res: Response, next: () => void) => {
    if (req.hostname.match(/(meteo-info\.kiev\.ua)|(localhost)/g)) {
        res.header('Access-Control-Allow-Origin', '*');
        const d = (await httpGet()).toString();
        const matchers = d.match(/time_radar\s?=\s?"(\d|\s|-)+/g);
        const v = matchers ? matchers[0].match(/\d{2,4}/g) : null;
        res.send({
            result: v || null,
        });
        return;
    }
    res.send('Access-Control-Allow-Origin blocked')
};
