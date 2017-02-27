import Vue from 'vue';
import template from './forecast-component.jade';
import './forecast-component.styl'

export const dataComponent = {

	template: template()
}
const forecastComponent = Vue.component('forecast-component',dataComponent);

export default forecastComponent