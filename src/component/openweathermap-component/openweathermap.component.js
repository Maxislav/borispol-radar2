import Vue from "vue";
import template from './openweathermap.component.html';
import './openweathermap.component.styl';
import {urlCron} from '../../config/congig-url';

export const OpenWeatherMapComponent = Vue.component('openweathermap-component', {
    template: template,
    data: function () {
        const variables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, val) => {
            acc.push(urlCron.openrain.concat('/', val));
            return acc
        }, []);
        const $this = this;

        return {
            prefix: '',
            suffix: '',
            variables: variables,
            mapUrl: urlCron.openmap,
            rainUrl: `${urlCron.openrain}/1`,
            load: 0,
            container: null,
            onload: (val) => {
                this.load = val
            },
            getUrlList(){
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((acc, val) => {
                    acc.push(urlCron.openrain.concat('/', val));
                    return acc
                }, [])
            },
            start(){
                $this.$refs.initialImage.$fadeTo(1, 0, 500)
            }
        }
    },

    mounted () {
        this.$set(this.$data, 'container', this.$refs.container)
      //   console.log(this.$refs.container)
    },

});
