import Vue from 'vue';
import './ired-component.styl'
import template from './ired-component.jade';
import dateFormat from 'dateformat';
import {urlCron} from '../../config/congig-url';
//import {autobind} from 'core-decorators';
import {autobind, enumerable, extendDescriptor} from 'core-decorators';


const variableUrls = [];
for (let i = 0; i<24; i++){
	variableUrls.push(dateFormat(new Date().toUtc().getTime() - (i*3600*1000), 'yyyymmddHH00'))
}

const IredComponent = Vue.component('ired-component',{
	template:  template(),
	data: function () {
		const initSrc = urlCron.ir + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif';

		return {
			initSrc,
			load: 0,
			onload: (val) => {
				this.load = val
			},
			prefix: urlCron.ir,
			variables: variableUrls,
			suffix: '.gif',
		}
	},
	mounted: function (){
		//console.log(this.$el);
	}


});
//const UkbbComponent ={template:  template()}

export default IredComponent;
