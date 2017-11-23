import Vue from 'vue';
import template from './setting-component.pug';
import './setting-component.styl';

let scope = null;

let port = null;

const onMessage = (e)=>{
	const mess = e.data;
	console.log(mess)
	port = event.ports[0]
	//event.ports[0].postMessage("SW Says 'Hello back!'")
};

const postMessage = (text) =>{
	if(!port){
		port = navigator.serviceWorker.controller
		if(port){
			port.postMessage("SW Says 'Hello back!'")
		}else {
			navigator.serviceWorker.ready
				.then(d=>{
					port.postMessage("SW Says 'Hello back!'")
				})
				.catch(err=>{
					console.log(err)
				})
		}

	}else {
		port.postMessage("SW Says 'Hello back!'")
	}

}

window.addEventListener('load', ()=>{
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			for(let registration of registrations) {
				registration.unregister()
			}

			/**
			 * {ServiceWorkerContainer}
			 */
			navigator.serviceWorker;
			navigator.serviceWorker.register('/sw.js').then(function(registration) {
				// Registration was successful
				scope = registration.scope;
				//console.log('ServiceWorker registration successful');
				navigator.serviceWorker.addEventListener('message', onMessage);

			}, function(err) {
				// registration failed :(
				console.log('ServiceWorker registration failed: ', err);
			});
		})
	}
});


export const SettingComponent = Vue.component('setting-component', {
	template: template(),
	data: function () {
		return{
			onStart: ()=>{



			},
			onStop: ()=>{


				console.log('stop')

				navigator.serviceWorker
					.ready
					.then(d=>{
						//console.log(d)
						//d.unregister()

						navigator.serviceWorker.getRegistrations()
							.then(function(registrations) {
								console.log(registrations)
								//ServiceWorkerRegistration.unregister(registrations)

								for(let registration of registrations) {
									registration.unregister()
								} });

					})

			},

			onNotify: function () {
				postMessage("Client 1 says")
				//navigator.serviceWorker.controller.postMessage("Client 1 says ");



				//SendPushMe()
				//navigator.serviceWorker.controller.postMessage("Client 1 says ");
/*
				navigator.serviceWorker.getRegistrations()
					.then(function(registrations) {
						for(let registration of registrations) {
							registration.unregister()
						} });*/



			}
			/*	Notification.requestPermission().then(function(result) {
					console.log(result);
					switch (result){
						case 'granted':

							break;
						default:


					}
				});
			}*/
		}
	}
});