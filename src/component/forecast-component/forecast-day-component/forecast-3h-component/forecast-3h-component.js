import Vue from 'vue';
import './forecast-3h-component.styl';
import template from  './forecast-3h-component.jade'

export default  Vue.component('forecast-3h-component', {
	props: ['hh'],
	template: template(),
	data: function () {
		console.log(this.hh)
		return{
			temp: this.hh.main.temp
		}
	}
	
});