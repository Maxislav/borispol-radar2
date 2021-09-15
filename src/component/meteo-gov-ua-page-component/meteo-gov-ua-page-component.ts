import vue from 'vue';
import template from './meteo-gov-ua-page-component.html';
import style from './meteo-gov-ua-page-component.less';

export const MeteoGovUaPageComponent = vue.component('meteo-gov-ua-page', {
    template: template,
    data(){
      return {
          style,
      }
    },
});
