import Vue from 'vue';
import VueResource  from 'vue-resource';
import {Deferred} from '../util/deferred';
import {Color} from '../constant/constant-hh-color';
const color = new Color();

/** @example data
{
	"dt":1490983200,
		"main":{
		"temp":9.78,
			"temp_min":9.78,
			"temp_max":10.03,
			"pressure":1018.05,
			"sea_level":1032.85,
			"grnd_level":1018.05,
			"humidity":87,
			"temp_kf":-0.25
	},
	"weather":[
		{
			"id":500,
			"main":"Rain",
			"description":"light rain",
			"icon":"10n"
		}
	],
		"clouds":{
		"all":92
	},
	"wind":{
		"speed":6.87,
			"deg":264.502
	},
	"rain":{
		"3h":1.125
	},
	"sys":{
		"pod":"n"
	},
	"dt_txt":"2017-03-31 18:00:00"
}
*/

let  def;
const current = {};
export const forecast5 = new Vue({
	data:{
		list: [],
		srcList: [],
		/*current: {
			color: null,
			dt_txt: null,
			main: null,
			weather: null,
			clouds: null,
			rain: null,
			sys:null
		},
		setCurrent: function (index) {
			return this.fill()
				.then(d=>{
					for(let key in this.srcList[index]){
						this.current[key] = this.srcList[index][key]
					}
					this.current.color = color.getColorByDate(this.current.dt_txt);
					return this.current
				})
		},*/
		/**
		 * @return {Promise.<Array>}
		 */
		fill: function () {
			if(!def){
				def = new Deferred();
				this.$http.jsonp('http://api.openweathermap.org/data/2.5/forecast?id=703448&units=metric&mode=json&APPID=19e738728f18421f2074f369bdb54e81')
					.then(({data}) => {
						let k;
						let day;
						data.list.forEach(
							/**
							 @param {Object} l
							 @param {string} l.dt_txt
							 */
							(l, i) => {
								const date = new Date(l.dt_txt);
								l.index = i;
								const d = date.getDate();
								if (d != k) {
									k = d;
									day = [];
									this.list.push(day)
								}
								day.push(l);
								this.srcList.push(l)
							});

						def.resolve(this.list);
					});
			}
			return def.promise
		}
	}
});
