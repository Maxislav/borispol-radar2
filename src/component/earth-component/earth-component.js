/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';

export const EarthComponent = Vue.component('android-component', {
  template: template(),
  data: function () {
    console.log(this.$http, 'dnjslkdfh')
    return{}
  }
  ,
  mounted: function() {
     console.log('djsodh')
  }
});
