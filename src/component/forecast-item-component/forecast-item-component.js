import Vue from 'vue';
import template from './forecast-item-component.pug';
import './forecast-item-component.styl'
import {forecast5} from '../../service/open-weather-map-service';


export const ForecastItemComponent = Vue.component('forecast-item-component', {
	template: template(),

	data: function () {

		const data = new Vue()

		data.$watch(()=>this.$route.path, (val)=>{
			forecast5.setCurrent(this.$route.params['index'])
		});
		forecast5.setCurrent(this.$route.params['index']);
		return forecast5.current

	},
	watch: {
		hh: function (val) {
			console.log(val)
		},
	}
});




