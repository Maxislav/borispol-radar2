import Vue from 'vue';
import template from './setting-component.pug';
import './setting-component.styl';


const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

var config = {
	apiKey : 'AIzaSyBK1TPsIwKh6uR7y1GQi9rekBbUOgo18T0'
};
firebase.initializeApp(config);


'use strict';


function SendPushMe() {
	if ('serviceWorker' in navigator) {
		console.log('Service Worker is supported');
		navigator.serviceWorker.register('/sw.js').then(function() {
			return navigator.serviceWorker.ready;
		}).then(function(reg) {
			console.log('Service Worker is ready :^)', reg);
			reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
				console.log('endpoint: ->', sub.endpoint);
				Vue.http.get( "http://meteo-radar.info/createpushadresat?adresat=" + sub.endpoint, function( data ) {});
			});
		}).catch(function(error) {
			console.log('Service Worker error :^(', error);
		});
	}
}




export const SettingComponent = Vue.component('setting-component', {
	template: template(),
	data: function () {
		return{
			onGetNotify: function () {
				SendPushMe()
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