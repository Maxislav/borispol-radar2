import Vue from 'vue';

import template from './forecast-component.jade';
import './forecast-component.styl'
import tinyscrollbar from '../../lib/tinyscrollbar.js';
import $ from 'jquery-lite';

let scrollEl;

export const dataComponent = {

	template: template(),
	data: function () {
		const list = [];
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
				const el = $(this.$el);
				const forecast = 	el.find('.forecast')
				setTimeout(()=>{
					forecast[0].parentNode.style.width = forecast[0].clientWidth+'px'
					scrollEl.update()
				}, 1)
			});
		return{
			list
		}
	},
	mounted: function () {
		const el = $(this.$el)//.tinyscrollbar()
	  scrollEl = 	tinyscrollbar(this.$el,{ axis: "x"})
	}
};
const forecastComponent = Vue.component('forecast-component',dataComponent);

export default forecastComponent