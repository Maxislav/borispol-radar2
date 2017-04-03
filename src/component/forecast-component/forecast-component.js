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

		this.$http.jsonp('https://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&mode=json&APPID=19e738728f18421f2074f369bdb54e81')
			.then(({data}) => {
				let k;
				let day;
				data.list.forEach(
					/**
					 * @example
					 {
					   "dt":1490983200,
					   "main":{
					      "temp":9.78,
					      "temp_min":9.78,
					      "temp_max":10.03,
					      "pressure":1018.05,
					      "sea_level":1032.85,
					      "grnd_level":1018.05,
					      "humidity":87,
					      "temp_kf":-0.25
					   },
					   "weather":[
					      {
					         "id":500,
					         "main":"Rain",
					         "description":"light rain",
					         "icon":"10n"
					      }
					   ],
					   "clouds":{
					      "all":92
					   },
					   "wind":{
					      "speed":6.87,
					      "deg":264.502
					   },
					   "rain":{
					      "3h":1.125
					   },
					   "sys":{
					      "pod":"n"
					   },
					   "dt_txt":"2017-03-31 18:00:00"
					}

					 @param {Object} l
					 @param {string} l.dt_txt
					 */
					(l) => {
						const date = new Date(l.dt_txt);
						const d = date.getDate();
						if (d != k) {
							k = d;
							day = [];
							list.push(day)
						}
						day.push(l)
					});

			});
		return {
			list
		}
	},
	mounted: function () {
		const el = $(this.$el)//.tinyscrollbar()
		scrollEl = tinyscrollbar(this.$el, {axis: "x"})
	},
	updated: function () {
		const el = $(this.$el);
		const forecast = el.find('.forecast')
		forecast[0].parentNode.style.width = forecast[0].clientWidth + 'px'
		scrollEl.update()
	},
	watch: {}
};

export default Vue.component('forecast-component', forecastData)