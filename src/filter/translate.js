import Vue from 'vue';
import {lang} from '../i18/navigator-lang';

Vue.filter('translate', (a, b)=>{
	return lang[a]
});