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
        let initialTime: Date = null;
        http.get<{
            result: number[],
        }>(urlCron['meteo-gov-ua-local'])
            .then((d) => {
                const {result} = d;
                initialTime = getDate(...result);
                const datestring = dateFormat(initialTime, 'yyyy-mm-dd HH-MM-00');
                this.$set(this.$data, 'src', `${urlCron['meteo-gov-ua']}/Ukr_J ${datestring}.jpg`)

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
        const $this = this;

        return {
            style,
            src: null,
            container: null,
            load: 0,
            stripVisible: false,
            getUrlList() {
                const arr = new Array(8);
                arr.fill(null);
                initialTime
                const result = arr.reduce((acc, val, index) => {
                    const t = initialTime.valueOf() - index * 10 * 60 * 1000;
                    const d = dateFormat(t, 'yyyy-mm-dd HH-MM-00');
                    const link = `${urlCron['meteo-gov-ua']}/Ukr_J ${d}.jpg`;
                    acc.push(link);
                    return acc
                }, []);
                console.log(result);
                return result
            },
            loadProgress(progress: { loading: boolean, value: number }) {
                //  $this.load = val.count
                $this.$set($this.$data, 'load', progress.value);
                $this.$set($this.$data, 'stripVisible', progress.loading);
                //console.log(val.loading)
            },
            start() {
                ($this.$refs.initialImage as any).$fadeTo(1, 0, 500)
            },
        }
    },
    mounted() {
        this.$set(this.$data, 'container', this.$refs.container)
    },
});
