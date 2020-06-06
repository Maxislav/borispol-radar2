"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./socket/user-room");
const app_1 = require("./app");
const borispolukbb = require("./borispolukbb");
const history = require("./borispolhistory.js");
const parserain_1 = require("./parserain/parserain");
require("./static");
app_1.app
    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain_1.parserain);
//# sourceMappingURL=borispol-radar.js.map