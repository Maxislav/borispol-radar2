
import Vue from 'vue'
import VueRouter from 'vue-router';

import './styl/index.styl'
import './component/forecast-component/forecast-component';

import './component/bookmark-component/bookmark-component'
import './directive/directive-img';
import './component/forecast-component/forecast-day-component/forecast-day-component';

import './filter/date'
import './component/strip-loader/strip-loader';
import './component/player-component/player-component'
import './component/forecast-component/forecast-day-component/forecast-3h-component/forecast-3h-component';
import HomeComponent from './component/home-component/home-component'
import IredComponent from './component/ired-component/ired-component'
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
