import * as express from 'express';
import * as http from 'http';
import { autobind } from 'core-decorators';
import {Express} from "express";
import * as socketIo from 'socket.io';


class App{
    private express: Express;
    private server: any;
    public io: any;

    constructor(private port: number){
        this.express = express();
        this.server = http.Server(this.express);
        this.io = socketIo(this.server)
        this.server.listen(port, this.serverStart)
    }

    @autobind
    private serverStart(): void{
        console.log(`node server start on port: ${this.port}`)
    }

    public get(...args): App{
        this.express.get(...args)
        return this
    }
}

export const app = new App(8085)
export const io  = app.io