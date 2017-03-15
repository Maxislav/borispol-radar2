
import Vue from 'vue'
import VueRouter from 'vue-router';

const css = require('./styl/index.styl');
import forecastComponent from './component/forecast-component/forecast-component';
import HomeComponent from './component/home-component/home-component'
import IredComponent from './component/ired-component/ired-component'
import VisibleComponent from './component/visible-component/visible-component'
import UkbbComponent from './component/ukbb-component/ukbb-component'
import BookmarkComponent from './component/bookmark-component/bookmark-component'
import './directive/directive-img';
import './component/forecast-component/forecast-day-component/forecast-day-component';
import VueResource from 'vue-resource'
import './filter/date'

import './component/player-component/player-component'
import './component/forecast-component/forecast-day-component/forecast-3h-component/forecast-3h-component';

Vue.use(VueRouter);
Vue.use(VueResource);




const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>booa</div>' };

const routes = [
	//{path:'/', component: {template: '<div>foo</div>' }},
	{ path: '/home', component: HomeComponent },
	{ path: '/radar', component: UkbbComponent },
	{ path: '/ired', component: IredComponent },
	{ path: '/visible', component: VisibleComponent },
	{ path: '/foo', component: Foo },
	{ path: '/bar', component: Bar }
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
/*
Date.prototype.toUtc = function () {
	const offset = new Date().getTimezoneOffset()*60000;
	return new Date(Date.now() + offset)
};*/
console.log(NODE_ENV)
/*Vue.directive('player-component', {
	inserted: function (el, binding) {
		console.log(binding.value);
	}
});*/
/*router.replace('/home', ()=>{

});*/
window.onload = function () {
	const app = new Vue({
		router
	}).$mount('#app');

};
