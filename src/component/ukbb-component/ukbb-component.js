import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';
import player from '../player-component/player-component'
//import { enumerable } from 'core-decorators';
import { readonly } from 'core-decorators';


class Ukbb {
    urls = [];

    constructor(){

    }


    loadHistory(){
		  return Vue.http.get('php/loadUkbbHistory.php')
    }
    play(){

    }
    back(){

    }
    forward(){

    }

}

const componentData ={
    template:  template(),
    data: function () {

      const ukbb = new Ukbb();

      return {
          play: ukbb.play,
	        back: ukbb.back,
	        forward: ukbb.forward
      }
    },
    compiled: function () {
        console.log(this)
    },
    mounted: function () {

        //console.log(this.$el)
    }
};


//export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default componentData;
