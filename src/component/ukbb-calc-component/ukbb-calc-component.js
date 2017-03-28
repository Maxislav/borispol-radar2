import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';
import {position} from  '../../util/position';


const toLngLat = {
	lng: (x)=>{
	 return	x*(33.89 - 27.9)/515 + 27.9
	},
	lat: (y)=>{
		return (470 - (y+55))*(52.14-48.35)/470 + 48.35
	}
};



export default {
	template: template(),
	data: function () {
		this.drag = false;
		this.layer = {
			x:0,
			y:0
		};

		const iam = {
			x: this.$storage.getItem('flag-x') || 680,
			y: this.$storage.getItem('flag-y') ||  0
		};

		return {
			onload: (img) =>{
				console.log(img)
			},
			lngLat: {
				lng:toLngLat.lng(iam.x),
				lat:toLngLat.lat(iam.y)
			},
			iam
		}
	},
	methods: {
		mousemove: function (e) {
			if(!this.drag) return;
			const {x, y} = {x: e.clientX, y: e.clientY};
			this.iam.x = e.x - this.container.x - this.layer.x;
			this.iam.y = e.y - this.container.y - this.layer.y;
			this.lngLat.lng = this.iam.x*(33.89 - 27.9)/515 + 27.9;
			this.lngLat.lat = toLngLat.lat(this.iam.y)
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