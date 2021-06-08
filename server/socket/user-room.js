"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const app_1 = require("../app");
const user_1 = require("./user");
class Room extends Array {
    constructor() {
        super();
        //defineTodayDate:
        this.todayUserList = []; //Array<User> = [];
        // console.log(this.defineTodayDate)
        this.defineTodayDate();
        this.todayUserList = [];
    }
    addUser(user) {
        const i = this.indexOf(user);
        if (i == -1) {
            this.push(user);
        }
        this.emitAllOnline();
        return this;
    }
    defineTodayDate() {
        const d = new Date();
        return this.today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    delUser(user) {
        while (-1 < this.indexOf(user)) {
            const i = this.indexOf(user);
            this.splice(i, 1);
        }
        return this;
    }
    getUniqCount() {
        const u = [];
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
    defineUser(user) {
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
    getUserList(userList = this) {
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
exports.Room = Room;
const room = new Room();
app_1.io.on('connect', (socket) => {
    new user_1.User(socket, room);
});
//# sourceMappingURL=user-room.js.map