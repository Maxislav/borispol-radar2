"use strict";
const CACHE_VERSION = 2;
const CURRENT_CACHES = {
	'read-through': 'read-through-cache-v' + CACHE_VERSION
};
let socket;

let i = 0;

self.addEventListener('install', function(event) {
	console.log('install', event);


	event.waitUntil(
		caches.open(CACHE_VERSION)
			.then(function (cache) {
				console.log('Opened cache');
				return cache.addAll([]);
			})
	);



	socket = new WebSocket("ws://localhost:8082")

	setInterval(()=>{
		self.clients.matchAll({includeUncontrolled: true, type: 'window'})
			.then(clients=>{
				//console.log(clients)
				clients.forEach(client=>{
					client.postMessage('Client postMessage ' + i++)
				})
			})
	}, 2000)
	self.skipWaiting()
});

self.addEventListener('activate', function(event) {
	// активация
	console.log('activate', event);

});

self.addEventListener('message', function(event){
	console.log("SW Received Message: " + event.data);
	//console.log(WebSocket)
	socket.send("Привет");



});

self.addEventListener('fetch', function(event) {

});