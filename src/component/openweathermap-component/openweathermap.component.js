import Vue from "vue";
import template from './openweathermap.component.html';
import './openweathermap.component.styl';
import {urlCron} from '../../config/congig-url';
export const OpenWeatherMapComponent = Vue.component('openweathermap-component', {
    template: template,
    data: function () {
        return {
            mapUrl: urlCron.openmap,
            rainUrl: urlCron.openrain
        }
    }
});
