import Vue from "vue";
import template from './openweathermap.component.html';
import style from './openweathermap.component.less';
import {urlCron} from '../../config/congig-url';
export const OpenWeatherMapComponent = Vue.component('openweathermap-component', {
    template: template,
    data: function () {
        const arr = (() => {
            const a = [];
            for(let i = 1 ; i< 25; i++){
                a.push(i)
            }
            return a
        })();

        const $this = this;


        return {
            style,
            prefix: '',
            suffix: '',
            mapUrl: urlCron.openmap,
            rainUrl: `${urlCron.openrain}/1`,
            load: 0,
            container: null,
            stripVisible: false,
            loadProgress:(progress: {loading: boolean, value: number}) =>{
               //  $this.load = val.count
                this.$set(this.$data, 'load', progress.value);
                this.$set(this.$data, 'stripVisible', progress.loading);
                //console.log(val.loading)
            },
            getUrlList(){
                return arr.reduce((acc, val) => {
                    acc.push(urlCron.openrain.concat('/', val));
                    return acc
                }, [])
            },
            start(){
                ($this.$refs.initialImage as any).$fadeTo(1, 0, 500)
            },

        }
    },

    mounted () {
        this.$set(this.$data, 'container', this.$refs.container)
    },

});
