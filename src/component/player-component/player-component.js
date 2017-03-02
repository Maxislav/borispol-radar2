import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss'




const dataComponent = {
	template: template(),
	data: function(){
		let count =  1
		return {
			message: '',
			count: 0,
			play: function (e) {
				console.log(count++)
			},
			stepBackward: function () {
			},
			stepForward: function () {
			}
		}
	}
};


export default Vue.component('player-component', dataComponent)