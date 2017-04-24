import Vue from 'vue';
import template from './forecast-item-component.pug';
import './forecast-item-component.styl'
import {forecast5} from '../../service/open-weather-map-service';
import {Color} from '../../constant/constant-hh-color';
const color = new Color();



export const ForecastItemComponent = Vue.component('forecast-item-component', {
	template: template(),

	data: function () {

		const data = new Vue({
			data: {
				hh:forecast5.fill().then(d=>{
					return this.hh = forecast5.srcList[this.$route.params['index']]
				}) ,
				color: 'white',
				icon: null,
				rain: [],
				style: null
			}
		});


		data.$watch(()=>this.$route.path, (val)=>{
			//data.hh = forecast5.srcList[this.$route.params['index']]
		});
		return data

	},
	watch: {
		hh: function (val) {
			this.color = color.getColorByDate(this.hh.dt_txt);
			this.icon =  'img/weather-ico/i01'+this.hh.weather[0].icon.match(/\D{1}$/)[0]+'.png';

			const rain3h = (this.hh.rain && this.hh.rain['3h']) ?   this.hh.rain['3h'] : null;
			//let rain = [];
			if(rain3h){
				this.rain.length = Math.round(rain3h*10) || 1
			}else {
				this.rain.length = 0
			}
			this.style = {
				transform: 'scale('+this.hh.clouds.all/100+')'
			};

		},
		'$route'(to, from){
			this.hh = forecast5.srcList[to.params.index]
		}
	}
});




