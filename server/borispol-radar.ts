import './socket/user-room'
import { app } from './app'
import { borispolukbb } from './borispolukbb';
import { history}  from './borispolhistory';
import { parserain } from './parserain/parserain';
import './static'
import './cron'


app

    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain);


