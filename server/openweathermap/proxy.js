"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyOpenRain = void 0;
const http = __importStar(require("http"));
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