import Vue from 'vue';
import  template from './forecast-day-component.jade';
import './forecast-day-component.styl';
export default  Vue.component('forecast-day-component',{
	template: template(),
	props: ['day'],
	data: function () {
		//console.log(this.day)
		const dt = new Date(this.$options.propsData.day[0].dt * 1000)
		return {
			dt
		}
	}
});