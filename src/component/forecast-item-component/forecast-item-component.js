import Vue from 'vue';
import template from './forecast-item-component.pug';
import './forecast-item-component.styl'
import {forecast5} from '../../service/open-weather-map-service'

export const ForecastItemComponent = Vue.component('forecast-item-component', {
	template: template(),

	data: function () {

		const data = new Vue({
			data: {
				hh: forecast5.srcList[this.$route.params['index']]
			}
		});
		data.$watch(()=>this.$route.path, (val)=>{
			data.hh = forecast5.srcList[this.$route.params['index']];
		});
		return data
	},
	watch: {
		routeParams: function (val) {
			console.log(val)

		}
	}
});




