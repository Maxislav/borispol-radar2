"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const core_decorators_1 = require("../node_modules/core-decorators/lib/core-decorators");
const socketIo = require("socket.io");
class App {
    constructor(port) {
        this.port = port;
        this.express = express();
        this.server = new http.Server(this.express);
        this.io = socketIo(this.server);
        this.server.listen(port, this.serverStart);
    }
    serverStart() {
        console.log(`->>>>>>>>>>>>>>>>>>>>> node server start on port: ${this.port} <<<<<<<<<<<<<<<<<<<<<<`.blue);
    }
    get(url, callback) {
        this.express.get(url, callback);
        return this;
    }
}
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], App.prototype, "serverStart", null);
exports.app = new App(8084);
exports.io = exports.app.io;
//# sourceMappingURL=app.js.map