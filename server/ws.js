const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8082});
let con = 0;
wss.on('connection', function connection(ws) {
	console.log('connection->', con++);

	ws.on('message', function incoming(data){
		console.log(data)
	});

	ws.on('error', (err)=>{
		console.error(err)
	});
	ws.on('close', (e)=>{
		console.log('Socket close->', e)
	});

	setTimeout(()=>{
		ws.send('something')
	}, 1000)


});