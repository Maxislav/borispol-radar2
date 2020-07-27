"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./socket/user-room");
const app_1 = require("./app");
const borispolukbb_1 = require("./borispolukbb");
const history = require("./borispolhistory.js");
const parserain_1 = require("./parserain/parserain");
require("./static");
require("./cron");
app_1.app
    .get('/borisbolukbb', borispolukbb_1.borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain_1.parserain);
//# sourceMappingURL=borispol-radar.js.map