import './socket/user-room';
import { app } from './app';
import { borispolukbb } from './borispolukbb';
import { history}  from './borispolhistory';
import { parserain } from './parserain/parserain';
import './static';
import './cron';
import {map} from "./openweathermap/openweathermap";
import {rain} from "./openweathermap/openweatherrain";


app
    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain)
    .get('/openmap', map)
    .get('/openrain', rain);


