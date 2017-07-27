import Vue from 'vue';
import template from './setting-component.pug';
import './setting-component.styl'
export const SettingComponent = Vue.component('setting-component', {
	template: template(),
	data: function () {
		return{
			onGetNotify: function () {
				Notification.requestPermission().then(function(result) {
					console.log(result);
					switch (result){
						case 'granted':

							break;
						default:


					}
				});
			}
		}
	}
});