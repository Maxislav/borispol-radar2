import Vue from 'vue';
import template from './player-component.jade';
//import '../../font-awesome/css/font-awesome.css'
import '../../font-awesome/scss/font-awesome.scss'
const dataComponent = {
	template: template(),
};

Vue.component('player-component', dataComponent)
export default dataComponent