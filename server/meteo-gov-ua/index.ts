import {Request, Response} from 'express-serve-static-core';
import https from 'https';
import dateFormat from 'dateformat';

const httpGetString = (): Promise<Buffer> => {
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
            console.error('meteo-gov-ua error ->', err);
            rej(err)
        });
        proxyRequest.end();
    })
};


const httpGetImage = (path: string): Promise<Buffer> => {
    return new Promise((resolve: any, reject: any) => {
        const options = {
            host: 'meteo.gov.ua',
            path,
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
                resolve(Buffer.concat(chunks))
            });
        });
        proxyRequest.on('error', function(err) {
            console.error('meteo-gov-ua error ->', err);
            reject(err)
        });
        proxyRequest.end();
    })
};

export const meteoGovUa = async (req: Request, res: Response, next: () => void) => {
    if (req.hostname.match(/(178\.62\.44\.54)|(meteo-info\.kiev\.ua)|(localhost)/g)) {
        res.header('Access-Control-Allow-Origin', '*');
        const d = (await httpGetString()).toString();
        const matchers = d.match(/time_radar\s?=\s?"(\d|\s|-)+/g);
        const v = matchers ? matchers[0].match(/\d{2,4}/g) : null;
        res.send({
            result: v || null,
        });
        return;
    }
    res.send('Access-Control-Allow-Origin blocked')
};

const getDate = (...args: number[]) => {
    const [a, b, c, d, e, i, f] = args.map(v => Number(v));
    return new Date(a || 0, b ? b - 1 : 0, c || 0, d || 0, e || 0, i || 0, f || 0)
};

export const meteoGovUaImage = async (req: Request, res: Response) => {
    console.log(req.params.step)
    res.header('Access-Control-Allow-Origin', '*');
    const d = (await httpGetString()).toString();
    const matchers = d.match(/time_radar\s?=\s?"(\d|\s|-)+/g);
    const v = matchers ? matchers[0].match(/\d{2,4}/g) : null;
    const initialTime = getDate(...v.map((dd: string) => Number(dd)))
    const datestring = dateFormat(initialTime, 'yyyy-mm-dd HH-MM-00');
    const newSrc = `https://meteo.gov.ua/radars/Ukr_J ${datestring}.jpg`;
    const path = encodeURI(`/radars/Ukr_J ${datestring}.jpg`);
    let r = null;
    try {

        r = await httpGetImage(path);
        res.contentType('image/jpeg');
    } catch (e) {
        r = e
    }
    res.send(r);
    return;
};
