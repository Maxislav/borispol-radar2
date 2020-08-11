import Vue from 'vue';
import template from './ukbb-component.pug';
import './ukbb-component.styl';
import {urlCron} from  '../../config/congig-url'


const UkbbComponent = Vue.component('ukbb-component',	{
		template: template(),
		props:['staticLoad'],
		data: function () {
		 const vm = new Vue({
				data: {
					src: urlCron.ukbb,
					callback: this.staticLoad,
					onerror: (e) => {
						console.error('onerror dsjasduh')
					}
				}
			});



		 this.interval= setInterval(()=>{
		 	  vm.src = urlCron.ukbb+'?date=' + new Date().toISOString()
		 }, 60000);

			return {
				vm,
				prefix: 'http://meteoinfo.by/radar/UKBB/',
				load: 0,
				onload: (val) => {
					this.load = val
				},
				suffix: '',
				err: 'По техническим причинам МРЛ не работает.'
			}
		},
		compiled: function () {
			console.log(this)
		},
		mounted: function () {

		},
		destroyed: function () {
			clearInterval(this.interval)
        }

	});


//export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default UkbbComponent;
