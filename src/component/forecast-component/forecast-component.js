import Vue from 'vue';

import template from './forecast-component.jade';
import './forecast-component.styl'
import tinyscrollbar from '../../lib/tinyscrollbar.js';
import $ from 'jquery-lite';

import {forecast5} from  '../../service/open-weather-map-service'



let scrollEl;
export const list = [];
export const forecastData = {
	template: template(),
	data: function () {
		forecast5.fill(forecast5);
		return forecast5
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