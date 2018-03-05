import * as socketIo from 'socket.io-client';
import {Deferred} from "../util/deferred";


export class Socket {
    constructor() {
        this._deferred = new Deferred(0);
        this.socket = null;
    }


    connect(url) {
        this.socket = socketIo.connect(url);
        Object.assign(this, this.socket)
        Object.setPrototypeOf(this, Object.getPrototypeOf(this.socket))
        this._deferred.resolve(this)
        return this
    }

    get promise() {
        return this._deferred.promise
    }


}

export const socket = new Socket()


