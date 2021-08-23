"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
require("../constant/console-color");
const openweatherrain_1 = require("./openweatherrain");
const PORT = 8087;
const server = express();
new http.Server(server)
    .listen(PORT, () => {
    console.log(`=== node version ${process.version}`.blue);
    console.log(`=== server open weather stated on port ${PORT} ===`.blue);
});
server
    .get('/openrain', openweatherrain_1.rain)
    .get('/openrain/:step', openweatherrain_1.rain);
//# sourceMappingURL=index.js.map