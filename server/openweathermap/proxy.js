"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyOpenRain = void 0;
const http = require("http");
const proxyOpenRain = (req, res) => {
    const options = {
        port: 8087,
        host: 'localhost',
        path: req.params.step ? `/openrain/${req.params.step}` : '/openrain'
    };
    const proxyRequest = http.request(options);
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