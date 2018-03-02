import { Room } from './user-room';


export class User{
    id: string;
    room:  Room<User>
    constructor(private socket){
        this.id = socket.id
    }

    on(eName: string, callback: Function){
        this.socket.on(eName, callback)
        return this;
    }

    emit(eName: string, value: any){
        this.socket.emit(eName, value)
        return this;
    }



    setRoom(room: Room<User>){
        this.room = room;
        return this
    }
}