import Vue from 'vue';
import template from './ukbb-calc-component.pug';
import './ukbb-calc-component.styl';
import constantRadarColor from '../../constant/constant-radar-color'
//import $ from 'jquery-lite';
import $ from 'jquery-lite/src/event';
import {position} from  '../../util/position';

console.log(constantRadarColor)

const toLngLat = {
	lng: (x)=>{
	 return	x*(33.89 - 27.9)/515 + 27.9
	},
	lat: (y)=>{
		return (470 - (y+55))*(52.14-48.35)/470 + 48.35
	}
};




class Rain{
	constructor(x,y, rgba){
		this.x = x;
		this.y = y;
		this.rgba = rgba;
		for(let opt in rgba){
			this[opt] = rgba[opt]
		}
		this.dist = null;
		this.hex = this._rgbToHex();
		this.colorHex = '#'+ this.hex;
		this.colorDec = parseInt(this.hex, 16)



	}


	_rgbToHex(){
		let hex = '';
		for(let opt in this.rgba){
			if(opt!='a'){
				let c = this.rgba[opt].toString(16);
				if (c.length<2) c = '0'+c;
				hex+=c
			}
		}
		return hex;
	}

	distFrom(x, y){
		const X = Math.abs(x-this.x);
		const Y = Math.abs(y-this.y);
		this.dist = Math.pow( Math.pow(X, 2)+ Math.pow(Y, 2), 1/2)*(200/470);

		return this.dist
	}



}
const calc = (rain, original)=>{

    const afterFilt = rain.filter((item)=>{
        return constantRadarColor.find((val)=>{
        	const find =  Math.abs(item.colorDec - val.colorDec) < 1000
        	if(find){
        		item.text = val.text
			}
            return find
        });
    });

    afterFilt.forEach(r => {
        r.distFrom(original.x, original.y)
    });

    afterFilt.sort((a, b) => {
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



    return afterFilt.filter(function (value, index, arr) {
        const find = colors.find((val) => {
            return Math.abs(value.colorDec - val) < 10
        });
        if (!find && (100<value.r || 100<value.g || 100<value.b )) {
            colors.push(value.colorDec);

            return true
        }
        return false
    });

};


export default {
	template: template(),
	data: function () {
		this.drag = false;
		this.layer = {
			x:0,
			y:0
		};

		this.original = {
			x: 0,
			y:0
		};

		this.image = null;
		const iam = {
			x: this.$storage.getItem('flag-x') || 680,
			y: this.$storage.getItem('flag-y') ||  0
		};

		const lngLat = {
			lng:toLngLat.lng(iam.x),
			lat:toLngLat.lat(iam.y)
		};

		const rain = [];

		this._rain = null;



		return {
			rain,
			onload: (image) =>{
				this.image = image;

				const canvas = document.createElement("canvas");
				canvas.width = image.naturalWidth;
				canvas.height = image.naturalHeight;
				const context = canvas.getContext("2d");
				context.drawImage(image, 0, 0);
				const imageData = context.getImageData(0, 0, 500, canvas.height );
				context.clearRect(0,0, canvas.width , canvas.height);
				context.putImageData(imageData,0,0);
				const data = [];
				const width = 500 ;
				for(let i = 0; i<imageData.data.length; i+=4){
						const d = imageData.data;
						const y = Math.floor(i/(width*4));
						const x = i/4 - (y)*width;
					if(!data[x] ){
						data.push([])
					}
					try{
						data[x].push({
							r:d[i],
							g:d[i+1],
							b:d[i+2],
							a:d[i+3]
						})
					}catch (err){
						console.log(x, data)
					}
				}
				const rain = this._rain =  [];
				data.forEach((d, x)=>{
					d.forEach((obj, y)=>{
						if(obj.r!=obj.g){
							rain.push(new Rain(x,y,obj))
						}
					})
				});
				if(this.iam.x<500){
					this.original.y = (this.iam.y+55)*(image.naturalHeight/image.height);
					this.original.x = (this.iam.x+5)*(image.naturalWidth/image.width);
					calc(this._rain, this.original).forEach(r=>this.rain.push(r))
				}
			},
			lngLat,
			iam
		}
	},
	methods: {
		mousemove: function (e) {
			if(!this.drag) return;
			this.iam.x = e.x - this.container.x - this.layer.x;
			this.iam.y = e.y - this.container.y - this.layer.y;
			this.lngLat.lng = this.iam.x*(33.89 - 27.9)/515 + 27.9;
			this.lngLat.lat = toLngLat.lat(this.iam.y);

			this.original.y = (this.iam.y+55)*(this.image.naturalHeight/this.image.height);
			this.original.x = (this.iam.x+5)*(this.image.naturalWidth/this.image.width);
			this.rain.length = 0;
			if(this.iam.x<500)
				calc(this._rain, this.original).forEach(r=>this.rain.push(r))

		},
		mousedown: function (e) {


			this.layer.x = e.layerX-(document.body.scrollLeft||0);
			this.layer.y = e.layerY-(document.body.scrollTop||0);

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

		console.log(this.container.y)
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