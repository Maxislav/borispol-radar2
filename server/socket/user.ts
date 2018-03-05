import { Room } from './user-room';
import { hashGen } from './keygen';
import { Deferred } from '../parserain/deferred.class';


export class User{
    id: string;
    public key: string;

    constructor(private socket, public room: Room<User>){
        this.id = socket.id;
        room.addUser(this)
        console.log('connect', room.length)
        this.socket.on('keygen', ({key}) =>{
            this.key = key || hashGen();
            this.emit('keygen', ({key: this.key}))
            this.room.emitAll('uniq', ({uniq: room.getUniqCount(), connection: room.length}))
        })
        this.on('disconnect', ()=>{
            this.room.delUser(this)
            this.room.emitAll('uniq', ({uniq: room.getUniqCount(), connection: room.length}))
        })
    }

    on(eName: string, callback: Function){
        this.socket.on(eName, callback)
        return this;
    }

    emit(eName: string, value: any){
        this.socket.emit(eName, value)
        return this;
    }

}