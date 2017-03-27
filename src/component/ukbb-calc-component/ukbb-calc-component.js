import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';
import {position} from  '../../util/position'

export default {
	template: template(),
	data: function () {

		return {
			iam: {
				x: 0,
				y: 0
			}
		}
	},
	methods: {
		mousemove: function (e) {
			const {x, y} = {x: e.clientX, y: e.clientY};
			this.iam.y = e.y-this.container.y;
			this.iam.x = e.x - this.container.x;
		}
	},
	beforeDestroy: function () {
	},
	mounted: function () {
		this.container = $(this.$el).find('.drawable-container');
		this.container.x = position(this.container[0]).x
		this.container.y = position(this.container[0]).y
	},
	updated: function () {
		const img = $(this.$el).find('img')
	},
	componentUpdated: function () {
		//console.log('dsds')
	}

}