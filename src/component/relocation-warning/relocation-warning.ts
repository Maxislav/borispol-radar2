import Vue from "vue";
import template from './relocation-warning.html';
import style from './relocation-warning.less';
export const RelocationWarning = Vue.component('relocation-warning', {
    template,
    data: function () {
        return {
            style,
            display: true,
            link: 'http://meteo-info.kiev.ua/#/home'
        }
    },
    mounted(){
        if(window.location.host.match(/borispol/)){
            console.log(window.location.host);
            this.$set(this.$data, 'display', true)
        }

    }
});
