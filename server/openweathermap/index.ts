import * as express from 'express';
import * as http from "http";
import '../constant/console-color'
import {rain} from "./openweatherrain";

const PORT = 8087;
const server = express();
new http.Server(server)
    .listen(PORT, () => {
        console.log(`=== node version ${process.version}`.blue)
        console.log(`=== server open weather stated on port ${PORT} ===`.blue)
    });
server
    .get('/openrain', rain)
    .get('/openrain/:step', rain);

