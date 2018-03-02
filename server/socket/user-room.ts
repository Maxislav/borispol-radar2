import { io } from '../app';
import { User} from './user';


export class Room<User> extends Array<User>{
    constructor(){
        super()
    }

    addUser(user: User){
        const i = this.indexOf(user)
        if(i < 0){
            this.push(user)
            user.setRoom(this)
        }
        this.emitAllOnline();
        console.log('connect', this.length)
        return this
    }

    delUser(user: User): Room<User>{
        while (-1<this.indexOf(user)){
            const i = this.indexOf(user)
            this.splice(i, 1)
        }
        this.emitAllOnline()
        console.log('disconnect', this.length)
        return this
    }

    emitAllOnline(){
        this.emitAll('online', this.length)
    }

    emitAll(name, value){
       this.forEach(user => user.emit(name, value))
    }

}

const room: Room<User>  = new Room();
io.on('connect', (socket) =>{
    const user = new User(socket);
    room.addUser(user);
    user.on('disconnect', () =>{
        room.delUser(user)
    })
})
