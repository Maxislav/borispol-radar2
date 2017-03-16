import Vue from 'vue';
import './ired-component.styl'
import template from './ired-component.jade';
import dateFormat from 'dateformat';
import {urlCron} from '../../config/congig-url';
//import {autobind} from 'core-decorators';
import {autobind, enumerable, extendDescriptor} from 'core-decorators';


import {Player} from '../player-component/player-component';
const variableUrls = [];
for (let i = 0; i<10; i++){
	variableUrls.push(dateFormat(new Date().toUtc().getTime() - (i*3600*1000), 'yyyymmddHH00'))
}
const player = new Player({
	prefix : urlCron.ir,
	variables: variableUrls,
	suffix : '.gif',
	initSrc : urlCron.ir + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif'
});


const IredComponent = Vue.component('ired-component',{
	template:  template(),
	data: function () {
		const initSrc = urlCron.ir + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif'

		const d = Object.assign({}, player);

		for(let key in player){
			console.log(key)
		}
	/*	Object.defineProperty(player, 'play',{enumerable: true, configurable: true, writable: true, value: function () {
			
		}})*/

		player.play
		console.log(player.play)
		console.log(Object.keys(player))
		/*Object.defineProperty(player, 'play',{enumerable: true, configurable: true, writable: true,
		get: function(){
			return function () {

			}
		}}	);
		Object.defineProperty(player, 'back',{enumerable: true, configurable: true, writable: true});
		Object.defineProperty(player, 'forward',{enumerable: true, configurable: true, writable: true});*/
		return player
	},

	mounted: function (){
		//console.log(this.$el);
	}

});
//const UkbbComponent ={template:  template()}

export default IredComponent;
