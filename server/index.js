const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const borispolukbb = require('./borispolukbb');
const history = require('./borispolhistory.js');
server.listen(8085, function() {
  console.log('node server start')
});
app.get('/borisbolukbb', borispolukbb);
app.get('/loadUkbbHistory', history);
