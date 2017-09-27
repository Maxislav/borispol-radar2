import Vue from 'vue';
import template from './setting-component.pug';
import './setting-component.styl';

let scope = null

window.addEventListener('load', ()=>{
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			for(let registration of registrations) {
				registration.unregister()
			}
			navigator.serviceWorker.register('/sw.js').then(function(registration) {
				// Registration was successful
				scope = registration.scope
				console.log('ServiceWorker registration successful with scope: ', registration.scope);


				navigator.serviceWorker.addEventListener('message', function(event){
					console.log(event.data);
					//event.ports[0].postMessage("Client 1 Says 'Hello back!'");
				});


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

				navigator.serviceWorker.controller.postMessage("Client 1 says ");



				//SendPushMe()
				//navigator.serviceWorker.controller.postMessage("Client 1 says ");
/*
				navigator.serviceWorker.getRegistrations()
					.then(function(registrations) {
						for(let registration of registrations) {
							registration.unregister()
						} });*/


				setTimeout(function () {

				/*	if ('serviceWorker' in navigator) {
						navigator.serviceWorker.register('/sw.js').then(function(registration) {
							// Registration was successful
							console.log('ServiceWorker registration successful with scope: ', registration.scope);
						}, function(err) {
							// registration failed :(
							console.log('ServiceWorker registration failed: ', err);
						});
					};*/

				}, 1000)

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