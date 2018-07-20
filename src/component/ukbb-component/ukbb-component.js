import Vue from 'vue';
import template from './ukbb-component.pug';
import './ukbb-component.styl';
import player from '../player-component/player-component'
//import { enumerable } from 'core-decorators';
import {Deferred} from '../../util/deferred'
import {autobind} from 'core-decorators';
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
						console.log('dsjasduh')
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
				suffix: ''
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
