"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyOpenRain = void 0;
const http_1 = __importDefault(require("http"));
const proxyOpenRain = (req, res) => {
    const options = {
        port: 8087,
        host: 'localhost',
        path: req.params.step ? `/openrain/${req.params.step}` : '/openrain',
    };
    const proxyRequest = http_1.default.request(options);
    const chunks = [];
    proxyRequest.on('response', function (proxyResponse) {
        proxyResponse.on('data', function (chunk) {
            chunks.push(chunk);
        });
        proxyResponse.on('end', function () {
            res.send(Buffer.concat(chunks));
        });
    });
    proxyRequest.on('error', function (err) {
        console.error('proxyOpenRain history err3 ->'.red, err);
        res.send(err);
    });
    req.on('data', function (chunk) {
        proxyRequest.write(chunk, 'binary');
    });
    req.on('end', function () {
        proxyRequest.end();
    });
};
exports.proxyOpenRain = proxyOpenRain;
//# sourceMappingURL=proxy.js.map