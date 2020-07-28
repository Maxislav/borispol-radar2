import * as express from 'express';
import * as http from 'http';
import { autobind } from '../node_modules/core-decorators/lib/core-decorators';
import {Express} from "express";
import * as socketIo from 'socket.io';


class App{
    private readonly express: Express;
    private readonly server: any;
    public io: any;

    constructor(private port: number){
        this.express = express();
        this.server = new http.Server(this.express);
        this.io = socketIo(this.server);
        this.server.listen(port, this.serverStart)
    }

    @autobind
    serverStart(): void{
        console.log(`->>>>>>>>>>>>>>>>>>>>>  node server start on port: ${this.port}`);
        console.error(`node server start on port: ${this.port}`);
    }

    public get(url, callback): App{
        this.express.get(url, callback);
        return this
    }
}

export const app = new App(8084);
export const io  = app.io;
