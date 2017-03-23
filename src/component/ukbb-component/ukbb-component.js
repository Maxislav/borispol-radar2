import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';
import player from '../player-component/player-component'
//import { enumerable } from 'core-decorators';
import {Deferred} from '../../util/deferred'
import {autobind} from 'core-decorators';
import {urlCron} from  '../../config/congig-url'
//console.log(Deferred);


const componentData = {
	template: template(),
	data: function () {



		return {
			staticUrl: urlCron.ukbb,
			prefix: 'http://meteoinfo.by/radar/UKBB/',
			load: 0,
			onload: (val) => {
				this.load = val
			},
			suffix: '',
		}
	},
	compiled: function () {
		console.log(this)
	},
	mounted: function () {

		//console.log(this.$el)
	}
};


//export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default componentData;
