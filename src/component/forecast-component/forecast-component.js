import Vue from 'vue';
import template from './forecast-component.jade';
import './forecast-component.styl'

const forecastComponent = Vue.component('forecast-component', {
	template: template()
});

export default forecastComponent