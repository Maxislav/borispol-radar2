
import Vue from 'vue'
import VueRouter from 'vue-router';
const css = require('./styl/index.styl');
Vue.use(VueRouter);


const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>booa</div>' };

const routes = [
	{ path: '/foo', component: Foo },
	{ path: '/bar', component: Bar }
];


const router = new VueRouter({
	routes // short for routes: routes
});

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
const app = new Vue({
	router
}).$mount('#app');
