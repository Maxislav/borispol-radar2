import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
import constantRadarColor from '../../constant/constant-radar-color'
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';
import {position} from  '../../util/position';
import {CanvasDirection} from  './canvas-direction';
import {getDirection} from './get-direction';
import {PixelData, pixelArray, toRain} from './pixel-data';


const toLngLat = {
	lng: (x) => {
		return x * (33.89 - 27.9) / 515 + 27.9
	},
	lat: (y) => {
		return (470 - y) * (52.14 - 48.35) / 470 + 48.35
	}
};


const filter = (rain, original, a) => {


	if (a) {
		a = Math.normalizeDegree(a);
		const {x, y} = original;
		rain = rain.filter(p => {
			let _a;
			if (x < p.x && p.y < y) {
				_a = (Math.atan((p.x - x) / (y - p.y)))
			} else if (x < p.x && y < p.y) {
				_a = (Math.atan((p.y - y) / (p.x - x))) + Math.PI / 2
			} else if (p.x < x && y < p.y) {
				_a = (Math.atan((x - p.x) / (p.y - y))) + Math.PI
			} else {
				_a = (Math.atan((y - p.y ) / (x - p.x))) + 3 * Math.PI / 2
			}
			_a = Math.degrees(_a);
			return Math.abs(a - _a) < 15
		})
	}

	const filterByColor = rain.filter((item) => {
		return constantRadarColor.find((val) => {
			const find = Math.abs(item.colorDec - val.colorDec) < 1000
			if (find) {
				item.text = val.text
			}
			return find
		});
	});

	filterByColor.forEach(r => {
		r.distFrom(original.x, original.y)
	});

	filterByColor.sort((a, b) => {
		if (a.dist < b.dist) {
			return -1
		}
		if (b.dist < a.dist) {
			return 1
		}
		if (a.dist == b.dist) {
			return 0
		}
	});

	const colors = [];


	return filterByColor.filter(function (value, index, arr) {
		const find = colors.find((val) => {
			return Math.abs(value.colorDec - val) < 10
		});
		if (!find && (100 < value.r || 100 < value.g || 100 < value.b )) {
			colors.push(value.colorDec);

			return true
		}
		return false
	});

};


export default {
	template: template(),
	data: function () {

		//console.log(this.$storage.getItem('show-flag'))
        if(this.$storage.getItem('show-flag')===undefined){
            this.$storage.setItem('show-flag', true)
		}

		let showFlag =  this.$storage.getItem('show-flag');

		this.drag = false;
		this.layer = {
			x: 0,
			y: 0
		};

		this.windDirection = null;

		this.original = {
			x: 0,
			y: 0
		};

		this.image = null;
		const iam = {
			x: this.$storage.getItem('flag-x') || 680,
			y: this.$storage.getItem('flag-y') || 0
		};


		this._rain = [];

		this.toOriginal = () => {
			return {
				x: (this.iam.x + 0) * (this.image.naturalWidth / this.image.width)-1,
				y: (this.iam.y + 22) * (this.image.naturalHeight / this.image.height)
			}
		};


		const lngLat = {
			lng: toLngLat.lng(iam.x +0),
			lat: toLngLat.lat(iam.y + 22)
		};

		const onload = (image) => {
			this.image = image;
			const canvas = document.createElement("canvas");
			canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;
			if (this.canvasDirection) this.canvasDirection.destroy()
			this.canvasDirection = new CanvasDirection(canvas);
			image.parentNode.appendChild(this.canvasDirection.el);

			const context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			context.clearRect(20,470, 10,10);
			const imageData = context.getImageData(0, 0, 500, canvas.height);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.putImageData(imageData, 0, 0);

			const data = pixelArray(imageData);
			this.windDirection = getDirection(data);
			console.log('windDirection', this.windDirection)
			this._rain.length = 0;
			toRain(data, this._rain);
			if (this.iam.x < 500) {
				const origin = this.toOriginal();
				this.original.x = origin.x;
				this.original.y = origin.y;
				if (this.windDirection != null) {
					this.canvasDirection.draw(this.original.x, this.original.y, this.windDirection + 180);
				}
				this.rain.length = 0;
				filter(this._rain, this.original, this.windDirection !== null ? this.windDirection + 180 : null).forEach(r => this.rain.push(r))
			}
		};

		return {
			onload,
			lngLat,
			rain: [],
			iam,
            showFlag
		}
	},
	watch:{
        showFlag: function (val) {
            this.$storage.setItem('show-flag', val)
        }
	},
	methods: {
		mousemove: function (e) {
			if (!this.drag) return;
			const position = {
				X: 0,
				Y:0
			};
			if(e instanceof TouchEvent){
				e.stopPropagation();
				e.preventDefault();

				const touch = e.changedTouches[0]
				position.X = touch.clientX
				position.Y = touch.clientY
			}else {
				position.X = e.clientX
				position.Y = e.clientY
			}

			this.iam.x = position.X - this.container.x - this.layer.x;
			this.iam.y = position.Y- this.container.y - this.layer.y;

			const origin = this.toOriginal();
			this.original.x = origin.x;
			this.original.y = origin.y;

			this.lngLat.lat = toLngLat.lat(this.original.y);
			this.lngLat.lng = toLngLat.lng(this.original.x);

			if (this.windDirection != null)
				this.canvasDirection.draw(this.original.x, this.original.y, this.windDirection + 180);

			this.rain.length = 0;
			if (this.iam.x < 500)
				filter(this._rain, this.original, this.windDirection !== null ? this.windDirection + 180 : null).forEach(r => this.rain.push(r))

		},
		mousedown: function (e) {

			if(e instanceof TouchEvent){
				const touch = e.changedTouches[0]
				this.layer.x = touch.clientX-position(e.target).x;
				this.layer.y = touch.clientY-position(e.target).y
				this.drag = true;
			}else{
				this.layer.x = e.layerX - (document.body.scrollLeft || 0);
				this.layer.y = e.layerY - (document.body.scrollTop || 0);
				this.drag = true;
			}

		}
	},
	beforeDestroy: function () {
		document.removeEventListener('mouseup', this._mouseup)
		document.removeEventListener('touchend', this._mouseup)
	},
	mounted: function () {
		this.container = $(this.$el).find('.drawable-container');
		this.container.x = position(this.container[0]).x;
		this.container.y = position(this.container[0]).y;
		this._mouseup = (e) => {
			this.drag = false;

			this.$storage.setItem('flag-x', this.iam.x);
			this.$storage.setItem('flag-y', this.iam.y)
		};
		document.addEventListener('mouseup', this._mouseup)
		document.addEventListener('touchend', this._mouseup)

	},
	updated: function () {
		const img = $(this.$el).find('img')
	},
	componentUpdated: function () {
		//console.log('dsds')
	}

}