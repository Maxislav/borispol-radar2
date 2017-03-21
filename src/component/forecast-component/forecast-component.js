import Vue from 'vue';

import template from './forecast-component.jade';
import './forecast-component.styl'
import tinyscrollbar from '../../lib/tinyscrollbar.js';
import $ from 'jquery-lite';

let scrollEl;
export const list = [];
export const forecastData = {
	template: template(),
	data: function () {

		this.$http.jsonp('http://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&mode=json&APPID=19e738728f18421f2074f369bdb54e81')
			.then(({data})=>{
				let k;
				let day;
				data.list.forEach(l=>{
					const date = new Date(l.dt*1000);
					const d = date.getDate();
					if(d!=k){
						k = d;
						day = [];
						list.push(day)
					}
					day.push(l)
				});

			});
		return{
			list
		}
	},
	mounted: function () {
		const el = $(this.$el)//.tinyscrollbar()
	  scrollEl = 	tinyscrollbar(this.$el,{ axis: "x"})
	},
	updated: function () {
		const el = $(this.$el);
		const forecast = 	el.find('.forecast')
		forecast[0].parentNode.style.width = forecast[0].clientWidth+'px'
		scrollEl.update()
	},
	watch: {

	}
};

export default Vue.component('forecast-component',forecastData)