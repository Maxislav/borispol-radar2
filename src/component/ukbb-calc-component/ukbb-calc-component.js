import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';
import {position} from  '../../util/position'

export default {
	template: template(),
	data: function () {
		this.drag = false;
		this.layer ={
			x:0,
			y:0
		};

		return {
			iam: {
				x: this.$storage.getItem('flag-x') || 680,
				y: this.$storage.getItem('flag-y') ||  0
			}
		}
	},
	methods: {
		mousemove: function (e) {
			if(!this.drag) return;
			const {x, y} = {x: e.clientX, y: e.clientY};
			this.iam.x = e.x - this.container.x - this.layer.x;
			this.iam.y = e.y - this.container.y - this.layer.y;
		},
		mousedown: function (e) {
			this.layer.x = e.layerX;
			this.layer.y = e.layerY;
			this.drag = true;
		}
	},
	beforeDestroy: function () {
		document.removeEventListener('mouseup', this._mouseup)
	},
	mounted: function () {
		this.container = $(this.$el).find('.drawable-container');
		this.container.x = position(this.container[0]).x;
		this.container.y = position(this.container[0]).y;
		this._mouseup = (e)=>{
			this.drag = false;

			this.$storage.setItem('flag-x', this.iam.x );
			this.$storage.setItem('flag-y', this.iam.y )
		}
		document.addEventListener('mouseup', this._mouseup)

	},
	updated: function () {
		const img = $(this.$el).find('img')
	},
	componentUpdated: function () {
		//console.log('dsds')
	}

}