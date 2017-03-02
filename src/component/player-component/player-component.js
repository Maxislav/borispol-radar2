import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss'
const dataComponent = {
	template: template(),
};

Vue.component('player-component', dataComponent)
export default dataComponent