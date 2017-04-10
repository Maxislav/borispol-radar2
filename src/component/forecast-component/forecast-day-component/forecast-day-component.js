import Vue from 'vue';
import  template from './forecast-day-component.jade';
import './forecast-day-component.styl';
export default  Vue.component('forecast-day-component',{
	template: template(),
	props: ['day'],
	data: function () {
		const dt = new Date(this.day[0].dt_txt);
		return {
			dt
		}
	}
});