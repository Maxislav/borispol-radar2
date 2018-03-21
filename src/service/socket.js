import * as socketIo from 'socket.io-client';
import {Deferred} from "../util/deferred";
import {socketUrl} from "../constant/constant-url";

let hash = 0;

const onName = {}
const deferredHash = {}

export const socket = socketIo.connect(socketUrl)
socket.promise = Promise.resolve(socket)
socket.$get = (name, data, opts) => {
    const tHash = hash++;
    const def = new Deferred()
    deferredHash[tHash] = def

    onName[name] = onName[name] || (() =>{
        socket.on(name, ({data, error, hash}) => {
            if(error){
                deferredHash[hash].reject({data, error})
            }else {
                deferredHash[hash].resolve({data, error})
            }

        })

        return true
    })()
    socket.emit(name, (Object.assign({hash: tHash}, data)));
    return deferredHash[tHash].promise
}


