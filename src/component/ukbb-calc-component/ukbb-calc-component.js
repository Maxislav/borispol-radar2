import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
import $ from 'jquery-lite';


export default {
	template: template(),
	data: function () {
		return {
			onload:  (img) =>{
				console.log(img)
			}
		}
	},
	mounted: function () {
		const container = $(this.$el).find('.img-ukbb')
		console.log(container)
	},
	updated: function () {
		const img = $(this.$el).find('img')
		//console.log(img)
	},
	componentUpdated: function () {
		//console.log('dsds')
	}

}