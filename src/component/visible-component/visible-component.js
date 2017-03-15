import Vue from 'vue';
import template from './visible-component.jade';
import './visible-component.styl';
import {Player} from '../player-component/player-component';
import {urlCron} from '../../config/congig-url';
import dateFormat from 'dateformat';
const VisibleComponent = Vue.component('visible-component',{
	template:  template(),
	data: function () {
		const url = urlCron.vi + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif';

		const variableUrls = [];
				for (let i = 0; i<10; i++){
			variableUrls.push(dateFormat(new Date().toUtc().getTime() - (i*3600*1000), 'yyyymmddHH00'))
		}
		const player = new Player({
			prefix : urlCron.vi,
			variables: variableUrls,
			suffix : '.gif',
		});


		//const player = new Player();
		return {
			url,
			play: player.play,
			back: player.back,
			forward: player.forward
		}
	}
});
//const UkbbComponent ={template:  template()}

export default VisibleComponent;

