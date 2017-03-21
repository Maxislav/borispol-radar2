
import Vue from 'vue'
import VueRouter from 'vue-router';

import './styl/index.styl'
import ForecastComponent from './component/forecast-component/forecast-component';
import {list} from './component/forecast-component/forecast-component';

import './component/bookmark-component/bookmark-component'
import './directive/directive-img';
import './component/forecast-component/forecast-day-component/forecast-day-component';

import './filter/date'
import './component/strip-loader/strip-loader';
import './component/player-component/player-component'
import './component/forecast-component/forecast-day-component/forecast-3h-component/forecast-3h-component';
import HomeComponent from './component/home-component/home-component'
import IredComponent from './component/ired-component/ired-component'
import MeteosatComponent from './component/meteosat-component/meteosat-component'
import VisibleComponent from './component/visible-component/visible-component'
import UkbbComponent from './component/ukbb-component/ukbb-component'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);



const routes = [
	{ path: '/home', component: HomeComponent },
	{ path: '/radar', component: UkbbComponent },
	{ path: '/ired', component: IredComponent },
	{ path: '/visible', component: VisibleComponent },
	{ path: '/meteosat', component: MeteosatComponent },
	{ path: '/forecast-hour/:index', component: {
			template: '<div>{{hh  }}</div>',
			data: function () {

				return {
					list: list,
					hh: {}
				}
			},
			watch: {
				list: function () {
					console.log(this.list);
					this.hh = this.list[this.$route.params['index']]
				}
			}
	} },
];


const router = new VueRouter({
	routes // short for routes: routes
});
router.beforeEach ((to, from, next) => {
	if(to.path == '/'){
		router.replace('/home', ()=>{
		})
	}
	next()
});

console.log(NODE_ENV)

window.onload = function () {
	const app = new Vue({
		router
	}).$mount('#app');

};
