
import Vue from 'vue'
import VueRouter from 'vue-router';
const css = require('./styl/index.styl');
import forecastComponent from './component/forecast-component/forecast-component';
import HomeComponent from './component/home-component/home-component'
import IredComponent from './component/ired-component/ired-component'
import VisibleComponent from './component/visible-component/visible-component'
import UkbbComponent from './component/ukbb-component/ukbb-component'
import BookmarkComponent from './component/bookmark-component/bookmark-component'
import './directive/directive-img'
Vue.use(VueRouter);


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
	next()
});

router.replace('/home', ()=>{

});
window.onload = function () {
	const app = new Vue({
		router
	}).$mount('#app');

};
