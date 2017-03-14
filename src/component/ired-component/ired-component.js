import Vue from 'vue';
import './ired-component.styl'
import template from './ired-component.jade';
import dateFormat from 'dateformat';
import {urlCron} from '../../config/congig-url';

import {Player} from '../player-component/player-component'

const IredComponent = Vue.component('ired-component',{
	template:  template(),
	data: function () {
		const url = urlCron.ir + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif';
		const player = new Player()
		return {
			url,
			play: player.play,
			back: player.back,
			forward: player.forward
		}
	}
});
//const UkbbComponent ={template:  template()}

export default IredComponent;
