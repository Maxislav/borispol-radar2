import { Room } from './user-room';
import { hashGen } from './keygen';
import { autobind } from 'core-decorators';

export class User{
    public id: string;
    public key: string;
    public date: Date;

    constructor(private socket, private room: Room<User>){
        this.id = socket.id;
        room.addUser(this)
        console.log('connect', JSON.stringify(room.getUserList(), null))

        this.socket.on('keygen', ({key}) =>{
            this.key = key || hashGen();
            this.emit('keygen', ({key: this.key}));
            this.date = new Date();
            console.log('keygen', JSON.stringify(room.getUserList(), null))
            room.defineUser(this);
            room.emitAll('uniq', ({
                uniq: room.getUniqCount(),
                connection: room.length,
                today: room.getTodayUserList().length
            }))
        })

        this.on('disconnect', ()=>{
            room.delUser(this)
            console.log('disconnect', JSON.stringify(room.getUserList(), null))
            room.emitAll('uniq', ({
                uniq: room.getUniqCount(),
                today: room.getTodayUserList().length
            }))
        })

        this.on('error', this.error)
    }

    on(eName: string, callback: Function){
        this.socket.on(eName, callback)
        return this;
    }

    emit(eName: string, value: any){
        this.socket.emit(eName, value)
        return this;
    }

    @autobind
    error(err) {
        console.log('error ->', err)
    }

}