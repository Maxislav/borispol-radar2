"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const keygen_1 = require("./keygen");
const core_decorators_1 = require("core-decorators");
const file_upload_1 = require("./file-upload");
var STATUS;
(function (STATUS) {
    STATUS[STATUS["PENDING"] = 0] = "PENDING";
    STATUS[STATUS["RESOLVE"] = 1] = "RESOLVE";
    STATUS[STATUS["REJECT"] = 2] = "REJECT";
})(STATUS || (STATUS = {}));
class User {
    constructor(socket, room) {
        this.socket = socket;
        this.room = room;
        this.id = socket.id;
        room.addUser(this);
        console.log('connect', JSON.stringify(room.getUserList(), null));
        this.socket.on('keygen', ({ key }) => {
            this.key = key || keygen_1.hashGen();
            this.emit('keygen', ({ key: this.key }));
            this.date = new Date();
            console.log('keygen', JSON.stringify(room.getUserList(), null));
            room.defineUser(this);
            room.emitAll('uniq', ({
                uniq: room.getUniqCount(),
                connection: room.length,
                today: room.getTodayUserList().length
            }));
        });
        this.socket.on('file', (d) => {
            file_upload_1.fileUpload(d)
                .then(fileName => {
                const resD = {
                    status: STATUS.RESOLVE,
                    hash: d.hash,
                    error: null,
                    data: fileName
                };
                socket.emit('file', resD);
            })
                .catch(err => {
                console.error(err);
                socket.emit('file', {
                    status: STATUS.REJECT,
                    hash: d.hash,
                    error: err,
                    data: null
                });
            });
        });
        this.on('disconnect', () => {
            room.delUser(this);
            console.log('disconnect', JSON.stringify(room.getUserList(), null));
            room.emitAll('uniq', ({
                uniq: room.getUniqCount(),
                today: room.getTodayUserList().length
            }));
        });
        this.on('error', this.error);
    }
    on(eName, callback) {
        this.socket.on(eName, callback);
        return this;
    }
    emit(eName, value) {
        this.socket.emit(eName, value);
        return this;
    }
    error(err) {
        console.log('error ->', err);
    }
}
__decorate([
    core_decorators_1.autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], User.prototype, "error", null);
exports.User = User;
//# sourceMappingURL=user.js.map