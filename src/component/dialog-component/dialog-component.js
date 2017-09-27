import Vue from 'vue';

import styles from './dialog-component.styl';
import template from './dialog-component.pug';

const DialogItemComponent = Vue.component('dialog-item-component', {
	template:'<div></div>',
	props:['options'],
	data: function () {

		//console.log(this.options)
		return {

		}
	}
})


export const DialogComponent = Vue.component('dialog-component', {
	template: template({styles}),  //'<div class='++'>Ololo</div>',
	data: function () {
		const dialogs = [];

		setTimeout(()=>{
			dialogs.push({
				title: 'ololo'
			})
		}, 1000)
		return {
			dialogs
		}
	}
});