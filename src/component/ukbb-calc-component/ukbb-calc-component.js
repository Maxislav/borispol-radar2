import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';


export default {
	template: template(),
	data: function () {
		const iam = {
			x: 0,
			y: 0
		};

		this._click = (e)=>{
			console.log(e)
		};

		this._move = (e)=>{
			//const {x, y} = {x:e.offsetX, y:e.offsetY}
			iam.x  = e.offsetX
			iam.y  = e.offsetY
			//console.log(x, y)
		};

		const imgOnLoad = (img)=>{
			this._$img = $(img);
			this._$img.on('click',this._click);
			this._$img.on('mousemove',this._move)
		};




		return {
			onload:  imgOnLoad,
			iam
		}
	},
	beforeDestroy: function () {
			this._$img.off('click', this._click)
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