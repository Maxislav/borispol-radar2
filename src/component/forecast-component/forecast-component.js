import Vue from 'vue';

import template from './forecast-component.jade';
import './forecast-component.styl'

export const dataComponent = {

	template: template(),
	data: function () {
		const list = [];


		this.$http.jsonp('http://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&mode=json&APPID=19e738728f18421f2074f369bdb54e81')
			.then(({data})=>{
				data.list.forEach(l=>list.push((l)))
				console.log(list)
			});

		return{
			list
		}
	}
}
const forecastComponent = Vue.component('forecast-component',dataComponent);

export default forecastComponent