import { io } from '../app';
import {IUser, User} from './user';
//import { autobind } from '../../node_modules/core-decorators/lib/co';
import { autobind } from '../../node_modules/core-decorators/src/core-decorators.js';


export class Room extends Array<User> {

    today: Date;
    //defineTodayDate:
    todayUserList: Array<User> = []; //Array<User> = [];

    constructor() {
        super();
       // console.log(this.defineTodayDate)

        this.defineTodayDate();
        this.todayUserList = []
    }

    addUser(user: User) {
        const i = this.indexOf(user);
        if (i == -1) {
            this.push(user);
        }
        this.emitAllOnline();
        return this;
    }

    defineTodayDate(): Date {
        const d = new Date();
        return this.today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    delUser(user: User): Room {
        while (-1 < this.indexOf(user)) {
            const i = this.indexOf(user);
            this.splice(i, 1);
        }
        return this;
    }


    getUniqCount(): number {
        const u: Array<string> = [];
        this.forEach(user => {
            if (user.key && u.indexOf(user.key) == -1) {
                u.push(user.key);
            }
        });
        return u.length;
    }

    emitAllOnline() {
        this.emitAll('online', this.length);
    }

    emitAll(name, value) {
        this.forEach(user => user.emit(name, value));
    }

    defineUser(user: User) {
        this.defineTodayDate();
        this.clearTodayUser();
        const index = this.todayUserList.findIndex(_user => _user.key == user.key);
        if (index == -1) {
            this.todayUserList.push(user);
        }
    }

    clearTodayUser() {
        for (let i = 0; i < this.todayUserList.length; i++) {
            const user = this.todayUserList[i];
            if (user.date.getDate() != this.today.getDate()) {
                this.todayUserList.splice(i, 1);
                return this.clearTodayUser();
            }
        }
    }

    getUserList(userList: Array<User> = this): Array<IUser> {
        return userList.map((user) => ({
            id: user.id,
            key: user.key,
            date: user.date
        }));
    }

    getTodayUserList() {
        return this.getUserList(this.todayUserList);
    }

}

const room: Room = new Room();

io.on('connect', (socket) => {
    new User(socket, room);
});
