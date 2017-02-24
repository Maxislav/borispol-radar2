
import Vue from 'vue'
import VueRouter from 'vue-router';
const css = require('./styl/index.styl');
import forecastComponent from './component/forecast-component/forecast-component';
import HomeComponent from './component/home-component/home-component'
import IredComponent from './component/ired-component/ired-component'
Vue.use(VueRouter);


const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>booa</div>' };

const routes = [
	{ path: '/home', component: HomeComponent },
	{ path: '/ired', component: IredComponent },
	{ path: '/foo', component: Foo },
	{ path: '/bar', component: Bar }
];


const router = new VueRouter({
	routes // short for routes: routes
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
window.onload = function () {
	const app = new Vue({
		router
	}).$mount('#app');

};
