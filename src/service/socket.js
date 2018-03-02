import * as socketIo from 'socket.io-client';
import {Deferred} from "../util/deferred";


export class Socket {
    constructor() {
        this._deferred = new Deferred(0);
        this._defConnect = new Deferred(1);
        this.socket = null;

    }


    connect(url) {
        this.socket = socketIo.connect(url);
        Object.assign(this, this.socket)
        Object.setPrototypeOf(this, this.socket)
        this.on('connect', ()=>{
            this._defConnect.resolve(this)
        })
        this._deferred.resolve(this)
        return this
    }

    onConnect(){
        return this._defConnect.promise
    }

    get promise() {
        return this._deferred.promise
    }
    onPromise(){return this.promise
    }

}

export const socket = new Socket()


