import Vue from 'vue';
import dateFormat from 'dateformat';
import {lang} from '../i18/navigator-lang';


const dayNames = lang.DAY_NAMES;

for(let i = 0; i <dayNames.length; i++){
    dateFormat.i18n.dayNames[i] = dayNames[i]
}

Vue.filter('date', (a, b)=>{
	return dateFormat(a, b)
});
