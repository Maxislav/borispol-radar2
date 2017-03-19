import Vue from 'vue';
import './forecast-3h-component.styl';
import template from  './forecast-3h-component.jade';
import dateFormat from 'dateformat';

export default  Vue.component('forecast-3h-component', {
	props: ['hh'],
	template: template(),
	data: function () {
		const R = {
			color: {
				hh00: '#99BCFF',
				hh03: '#CCDDFF',
				hh06: '#CDF',
				hh09: '#E6EEFF',
				hh12: '#E6EEFF',
				hh15: '#E6EBF5',
				hh18: '#CCDDFF',
				hh21: '#B3CDFF'
			}
		};

		const date = new Date(this.hh['dt_txt']);
		const temp = Math.round(this.hh.main.temp);

		const HH ='hh'+ dateFormat(date, 'HH');
		const icon = 'img/weather-ico/i01'+this.hh.weather[0].icon.match(/\D{1}$/)[0]+'.png';
		//console.log(this.hh.clouds.all);
		const style = {
			transform: 'scale('+this.hh.clouds.all/100+')'
		};

		const rain3h = (this.hh.rain && this.hh.rain['3h']) ?   this.hh.rain['3h'] : null;
		let rain = [];
		if(rain3h){
			rain.length = Math.round(rain3h*10) || 1

		}
		return{
			date,
			temp: (temp<0 ? '-'+temp : '+'+temp)  +'&deg;C',
			color: R.color[HH],
			style,
			icon,
			rain
		}
	}
	
});