import Vue from 'vue';
import './forecast-3h-component.styl';
import template from  './forecast-3h-component.jade';
import dateFormat from 'dateformat';

export default  Vue.component('forecast-3h-component', {
	props: ['hh'],
	template: template(),
	data: function () {
		var R = {
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
		const temp = Math.round(this.hh.main.temp)

		const HH ='hh'+ dateFormat(date, 'HH');
		return{
			date,
			temp: (temp<0 ? '-'+temp : '+'+temp)  +'&deg;C',
			color: R.color[HH]
		}
	}
	
});