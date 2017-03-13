import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';


const dataComponent = {
	template: template(),
	props: ['play', 'back', 'forward'],
	data: function (e, a) {

		const back = this.back;
		const play = this.play;

		return {
			onPlay: (e) => {
				this.play(e)
			},
			onBack: (e)=>{
				back(e)
			},
			onForward: (e) => {
				this.forward(e)
			}
		}
	}
};


export default Vue.component('player-component', dataComponent)