import Vue from 'vue';
import template from './home-component.html'
import style from './home-component.less'

console.log(style);
const HomeComponent = Vue.component('sds', {
    template: template,
    data() {
        return {
            style,
        }
    },
});
export default HomeComponent;
