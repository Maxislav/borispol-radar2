import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';


const dataComponent = {
	template: template(),
	props: ['play', 'back', 'forward'],
	data: function (e, a) {

		//console.log(this._play)

		return {
			onPlay: (e) => {
				//console.log( this._play)
			},
			"onBack": ()=>{
				console.log('olds')
			},
			onForward: () => {
			}
		}
	}
};


export default Vue.component('player-component', dataComponent)