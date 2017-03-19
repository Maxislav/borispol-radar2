import Vue from 'vue';
import template from './visible-component.jade';
import './visible-component.styl';
import {urlCron} from '../../config/congig-url';
import dateFormat from 'dateformat';


const variableUrls = [];
for (let i = 0; i<24; i++){
	variableUrls.push(dateFormat(new Date().toUtc().getTime() - (i*3600*1000), 'yyyymmddHH00'))
}
const VisibleComponent = Vue.component('visible-component',{
	template:  template(),
	data: function () {
		const initSrc = urlCron.vi + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif';

		return {
			initSrc,load: 0,
            onload: (val) =>{
                this.load = val
            },

			prefix : urlCron.vi,
			variables: variableUrls,
			suffix : '.gif',
		}
	}
});
//const UkbbComponent ={template:  template()}

export default VisibleComponent;

