"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meteoGovUaImage = exports.meteoGovUa = void 0;
const https_1 = __importDefault(require("https"));
const dateformat_1 = __importDefault(require("dateformat"));
const httpGetString = () => {
    return new Promise((res, rej) => {
        const options = {
            //  port: 80,
            host: 'meteo.gov.ua',
            path: '/ua/33345/radar/',
            method: 'GET',
        };
        const proxyRequest = https_1.default.request(options);
        const chunks = [];
        proxyRequest.on('response', function (proxyResponse) {
            proxyResponse.on('data', function (chunk) {
                chunks.push(chunk);
            });
            proxyResponse.on('end', function () {
                // res.send(Buffer.concat(chunks))
                res(Buffer.concat(chunks));
            });
        });
        proxyRequest.on('error', function (err) {
            console.error('meteo-gov-ua error ->', err);
            rej(err);
        });
        proxyRequest.end();
    });
};
const httpGetImage = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            host: 'meteo.gov.ua',
            path,
            method: 'GET',
        };
        const proxyRequest = https_1.default.request(options);
        const chunks = [];
        proxyRequest.on('response', function (proxyResponse) {
            proxyResponse.on('data', function (chunk) {
                chunks.push(chunk);
            });
            proxyResponse.on('end', function () {
                // res.send(Buffer.concat(chunks))
                resolve(Buffer.concat(chunks));
            });
        });
        proxyRequest.on('error', function (err) {
            console.error('meteo-gov-ua error ->', err);
            reject(err);
        });
        proxyRequest.end();
    });
};
const meteoGovUa = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.hostname.match(/(178\.62\.44\.54)|(meteo-info\.kiev\.ua)|(localhost)/g)) {
        res.header('Access-Control-Allow-Origin', '*');
        const d = (yield httpGetString()).toString();
        const matchers = d.match(/time_radar\s?=\s?"(\d|\s|-)+/g);
        const v = matchers ? matchers[0].match(/\d{2,4}/g) : null;
        res.send({
            result: v || null,
        });
        return;
    }
    res.send('Access-Control-Allow-Origin blocked');
});
exports.meteoGovUa = meteoGovUa;
const getDate = (...args) => {
    const [a, b, c, d, e, i, f] = args.map(v => Number(v));
    return new Date(a || 0, b ? b - 1 : 0, c || 0, d || 0, e || 0, i || 0, f || 0);
};
const meteoGovUaImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.step);
    res.header('Access-Control-Allow-Origin', '*');
    const d = (yield httpGetString()).toString();
    const matchers = d.match(/time_radar\s?=\s?"(\d|\s|-)+/g);
    const v = matchers ? matchers[0].match(/\d{2,4}/g) : null;
    const initialTime = getDate(...v.map((dd) => Number(dd)));
    const datestring = dateformat_1.default(initialTime, 'yyyy-mm-dd HH-MM-00');
    const newSrc = `https://meteo.gov.ua/radars/Ukr_J ${datestring}.jpg`;
    const path = encodeURI(`/radars/Ukr_J ${datestring}.jpg`);
    let r = null;
    try {
        r = yield httpGetImage(path);
        res.contentType('image/jpeg');
    }
    catch (e) {
        r = e;
    }
    res.send(r);
    return;
});
exports.meteoGovUaImage = meteoGovUaImage;
//# sourceMappingURL=index.js.map