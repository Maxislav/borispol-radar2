import express from 'express';
import {Express} from 'express';
import  http from 'http';
import socketIo from 'socket.io';
import {autobind} from './utils/autobind';

class App {
    private readonly express: Express = express();
    private readonly server: any;
    public io: any;

    constructor(private port: number) {
        this.server = new http.Server(this.express);
        this.io = socketIo(this.server);
        this.server.listen(port, this.serverStart)
    }

    @autobind()
    serverStart(): void {
        console.log(`->>>>>>>>>>>>>>>>>>>>> node server start on port: ${this.port} <<<<<<<<<<<<<<<<<<<<<<`.blue);
    }

    public get(url: string, callback: (req: any, res: any, next?: any) => any): App {
        this.express.get(url, callback);
        return this
    }
}

export const app = new App(8084);
export const io = app.io;
