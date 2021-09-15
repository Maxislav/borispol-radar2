import vue from 'vue';
import template from './meteo-gov-ua-component.html';

import style from './meteo-gov-ua-component.less';
import dateFormat from 'dateformat';
export const MeteoGovUaComponent = vue.component('meteo-gov-ua', {
    template: template,
    data() {

        const currentDate = new Date(new Date().valueOf() + new Date().getTimezoneOffset()*60*1000);
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        const minutes = Math.floor((currentDate.getMinutes() -1 )/ 10) * 10 + 9;
        currentDate.setMinutes(minutes);
       // console.log(currentDate);
        const datestring = dateFormat(currentDate, 'yyyy-mm-dd HH-MM-00')
        console.log(datestring)
        //  const parsedDate =  new Date(currentDate.getFullYear(), )
        const src = `https://meteo.gov.ua/radars/Ukr_J ${datestring}.jpg`;

        return {
            style,
            src,
        }
    },
});
