"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./socket/user-room");
const app_1 = require("./app");
const borispolukbb_1 = require("./borispolukbb");
const borispolhistory_1 = require("./borispolhistory");
const parserain_1 = require("./parserain/parserain");
require("./static");
require("./cron");
const openweathermap_1 = require("./openweathermap/openweathermap");
const openweatherrain_1 = require("./openweathermap/openweatherrain");
const proxy_1 = require("./openweathermap/proxy");
const meteo_gov_ua_1 = require("./meteo-gov-ua");
app_1.app
    .get('/borisbolukbb', borispolukbb_1.borispolukbb)
    .get('/loadUkbbHistory', borispolhistory_1.history)
    .get('/parserain', parserain_1.parserain)
    .get('/openmap', openweathermap_1.map)
    .get('/openrain', openweatherrain_1.rain)
    .get('/openrain/:step', proxy_1.proxyOpenRain)
    .get('/meteo-gov-ua', meteo_gov_ua_1.meteoGovUa);
//# sourceMappingURL=borispol-radar.js.map