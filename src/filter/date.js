import Vue from 'vue';
import dateFormat from 'dateformat';

const dayNames = ['Вос', 'Пон', 'Втр', 'Срд' , 'Чет', 'Пят', "Суб"];

for(let i = 0; i <dayNames.length; i++){
    dateFormat.i18n.dayNames[i] = dayNames[i]
}

Vue.filter('date', (a, b)=>{
	return dateFormat(a, b)
});
