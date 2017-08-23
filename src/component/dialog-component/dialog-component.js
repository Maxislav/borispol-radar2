import Vue from 'vue';

import styles from './dialog-component.styl';
import template from './dialog-component.pug';
console.log(styles)

export const DialogComponent = Vue.component('dialog-component', {
	template: template({styles}),  //'<div class='++'>Ololo</div>',
	data: function () {
		return {
		}
	}
});