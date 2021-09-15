"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
require("../constant/console-color");
const openweatherrain_1 = require("./openweatherrain");
const PORT = 8087;
const server = express_1.default();
new http_1.default.Server(server)
    .listen(PORT, () => {
    console.log(`=== node version ${process.version}`.blue);
    console.log(`=== server open weather stated on port ${PORT} ===`.blue);
});
server
    .get('/openrain', openweatherrain_1.rain)
    .get('/openrain/:step', openweatherrain_1.rain);
//# sourceMappingURL=index.js.map