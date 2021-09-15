import Vue from 'vue';
import template from './meteo-gov-ua-component.html';
import style from './meteo-gov-ua-component.less';
import dateFormat from 'dateformat';
import {urlCron} from '../../../config/congig-url';
import {http} from '../../../util/http';

const getDate = (...args: number[]) => {
    const [a, b, c, d, e, i, f] = args.map(v => Number(v));
    return new Date(a || 0, b ? b - 1 : 0, c || 0, d || 0, e || 0, i || 0, f || 0)
};
export const MeteoGovUaComponent = Vue.component('meteo-gov-ua', {
    template: template,
    data() {
        http.get<{
            result: number[],
        }>(urlCron['meteo-gov-ua'])
            .then((d) => {
                const {result} = d;
                const datestring = dateFormat(getDate(...result), 'yyyy-mm-dd HH-MM-00');
                this.$set(this.$data, 'src', `https://meteo.gov.ua/radars/Ukr_J ${datestring}.jpg`)

            }).catch(e => {
            console.log(e)
        });


        const currentDate = new Date(new Date().valueOf() + new Date().getTimezoneOffset() * 60 * 1000);
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        const minutes = Math.floor((currentDate.getMinutes() - 1) / 10) * 10 + 9;
        currentDate.setMinutes(minutes);
        // console.log(currentDate);
        const datestring = dateFormat(currentDate, 'yyyy-mm-dd HH-MM-00')
        console.log(datestring)
        //  const parsedDate =  new Date(currentDate.getFullYear(), )
        // console.log(this.data)


        return {
            style,
            src: null,
        }
    },
});
