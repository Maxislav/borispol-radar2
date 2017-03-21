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
			staticUrl: urlCron.ukbb
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
