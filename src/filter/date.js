import Vue from 'vue';
import dateFormat from 'dateformat';

Vue.filter('date', (a, b)=>{
	return dateFormat(a, b)
});
