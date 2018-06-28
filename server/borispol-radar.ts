import './socket/user-room'
import { app } from './app'
import * as borispolukbb from './borispolukbb';
import * as history  from'./borispolhistory.js';
import {parserain} from './parserain/parserain';
import './static'
import {defaultSettiong} from "./phplike/settingborispolradar";
console.log('djhskdchf')

app
    .get('/php', defaultSettiong)
    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain);


