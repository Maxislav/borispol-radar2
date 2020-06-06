"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const borispolukbb = require("./borispolukbb");
const history = require("./borispolhistory.js");
const parserain_1 = require("./parserain/parserain");
class A extends Array {
    constructor(a) {
        super(a);
    }
    getFirst() {
        return this[0];
    }
}
const a = new A(2);
app_1.app
    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain_1.parserain);
//# sourceMappingURL=index.js.map