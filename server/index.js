const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const borispolukbb = require('./borispolukbb');
server.listen(8081);
app.get('/borisbolukbb', borispolukbb);