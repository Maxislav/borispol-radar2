import { io } from '../app';
import { User} from './user';
import { autobind } from 'core-decorators';


export class Room<User> extends Array<User>{
    constructor(){
        super()
    }

    addUser(user: User){
        const i = this.indexOf(user)
        if(i < 0){
            this.push(user)
        }
        this.emitAllOnline();

        return this
    }

    delUser(user: User): Room<User>{
        while (-1<this.indexOf(user)){
            const i = this.indexOf(user)
            this.splice(i, 1)
        }
        return this
    }


    getUniqCount(): number{
        const u: Array<number> = [];
        this.forEach(user=>{
            if( user.key && u.indexOf(user.key) == -1 ){
                u.push(user.key)
            }
        })
        return u.length
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
     new User(socket, room);
})
