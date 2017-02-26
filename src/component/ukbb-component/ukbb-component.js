import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';

const componentData ={
    template:  template(),
    compiled: function () {
        //console.log(this)
    },
    mounted: function () {

        //console.log(this.$el)
    }

}


export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default componentData;
