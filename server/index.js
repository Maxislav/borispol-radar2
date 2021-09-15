"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const borispolukbb_1 = require("./borispolukbb");
const borispolhistory_js_1 = require("./borispolhistory.js");
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
    .get('/borisbolukbb', borispolukbb_1.borispolukbb)
    .get('/loadUkbbHistory', borispolhistory_js_1.history)
    .get('/parserain', parserain_1.parserain);
//# sourceMappingURL=index.js.map