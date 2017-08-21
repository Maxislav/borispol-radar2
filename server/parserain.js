const express = require('express');
const app = express();
const url = require('url');

const server = require('http').Server(app);
server.listen(8084);

app.get('/parserain', (req, res, next)=>{
	const url_parts = url.parse(req.url, true);
	const query = url_parts.query;
	res.end('hello')

});



