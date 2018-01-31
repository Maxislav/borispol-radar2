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
    const wind = {...this.hh.wind,
      speed: this.hh.wind ? Math.toFixed(this.hh.wind.speed, 1) : 0
  	}
		console.log(wind.deg)


		const HH ='hh'+ dateFormat(date, 'HH');
		const icon = 'img/weather-ico/i01'+this.hh.weather[0].icon.match(/\D{1}$/)[0]+'.png';
		//console.log(this.hh.clouds.all);
		const style = {
			transform: 'scale('+this.hh.clouds.all/100+')'
		};

		const rain3h = (this.hh.rain && this.hh.rain['3h']) ?   this.hh.rain['3h'] : null;
		//console.log((this.hh && this.hh.snow['3h']) ? this.hh.snow['3h'] : null)
		const snow3h = (this.hh && this.hh.snow && this.hh.snow['3h']) ? this.hh.snow['3h'] : null

		let rain = [];
		if(rain3h){
			rain.length = Math.round(rain3h*10) || 1
		}
		let snow = [];
		if(snow3h){
      snow.length = Math.round(snow3h*10) || 1
		}

		let title = '';

		if(rain.length){
      title = title.concat('Rain 3h: ' + Math.toFixed (this.hh.rain['3h'], 3)+'mm')
		}

		if(snow.length){
      title = title.concat('\n','Snow 3h: ' + Math.toFixed (this.hh.snow['3h'], 3)+'mm')
		}

		return{
			date,
			temp: (temp<0 ? ''+temp : '+'+temp)  +'&deg;C',
			color: R.color[HH],
			style,
			icon,
			rain,
			snow,
			wind,
			index:this.hh.index,
			title:  title ? title: 'Clear'
		}
	},
	methods: {
		click: function (e, index) {
			this.$router.push({name: 'forecast-item', params: {index}, canReuse: false})
			//console.log()
		}
	}
	
});