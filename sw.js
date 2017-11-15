"use strict";
const CACHE_VERSION = 2;
const CURRENT_CACHES = {
	'read-through': 'read-through-cache-v' + CACHE_VERSION
};
let socket;


class $Promise extends Promise {
	constructor(f) {
		let res = null;
		let rej = null;
		let r, j;
		let _f = f;
		if(!_f){
			_f = function (_res, _rej) {
				res = _res;
				rej = _rej;
				if(r!==undefined) res(r);
				if(j!==undefined) rej(j);
			}
		}
		super(_f);
		this.resolve = (_r)=>{
			r = _r;
			if(res) res(_r);
			return this;
		};

		this.reject = (_j)=>{
			j = _j;
			if(rej) rej(_j);
			return this
		};
	}
}

class Socket extends WebSocket{
	constructor(...args){
		super(...args);
		this._events = {};
		this._ready = false;
		this._r = null;
		this.onopen = (e)=>{
			console.log("Соединение установлено.");

			this._ready = true;
			if(this._r) this._r(this);
		};
		this.onmessage = (e)=>{
			this._events['message'] = this._events['message'] || []
			this._events['message'].forEach(f=>{
				f(e)
			});
			return this;
		};
	}
	on(eName, f){
		this._events[eName] = this._events[eName] || []
		this._events[eName].push(f);
		return this;
	}
	off(eName, f){
		this._events[eName] = this._events[eName] || []
		if(f){
			const index = this._events[eName].findIndex(f)
			if(-1<index){
				this._events[eName].splice(index,1)
			}
		}else {
			while (this._events[eName].length){
				this._events[eName].pop()
			}
		}
		return this
	}
	then(r){
		this._r = r;
		if(this._ready) this._r(this);
		return this
	}
}


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



	socket =  new Socket("ws://localhost:8082")
	socket.on('message', (e)=>{
		console.log("сокет сообщение получено ", e.data)
	});





	/*socket.onopen = function() {
		console.log("Соединение установлено.")
		socketPromise.resolve(socket)

	};
*/


	/*setInterval(()=>{
		self.clients.matchAll({includeUncontrolled: true, type: 'window'})
			.then(clients=>{
				//console.log(clients)
				clients.forEach(client=>{
					client.postMessage('Client postMessage ' + i++)
				})
			})
	}, 2000)*/
	//self.skipWaiting()
});

self.addEventListener('activate', function(event) {
	// активация
	console.log('activate', event);

});

self.addEventListener('message', function(event){
	console.log("SW Received Message: " + event.data);






});

self.addEventListener('fetch', function(event) {

});