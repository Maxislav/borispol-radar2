import Vue from 'vue';

Vue.filter('toFixed', (value, n)=>{



	return (Math.round(value * Math.pow(10, n || 0)) / Math.pow(10, n || 0)).toFixed(n || 0)
});
