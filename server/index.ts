import { app } from './app';
import * as borispolukbb from './borispolukbb';
import * as history from './borispolhistory.js';
import { parserain } from './parserain/parserain';


class A extends Array {
    constructor(a) {
        super(a);
    }

    getFirst() {
        return this[0];
    }
}

const a = new A(2);

app
    .get('/borisbolukbb', borispolukbb)
    .get('/loadUkbbHistory', history)
    .get('/parserain', parserain);
