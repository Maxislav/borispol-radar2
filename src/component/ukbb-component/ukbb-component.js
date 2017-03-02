import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';
import player from '../player-component/player-component'

//.img-ukbb(v-img="'http://localhost:8081/borisbolukbb'")


/*
player.play = ()=>{
    console.log('play')
}
player.stepBackward = ()=>{
    console.log('Назад')
}
player.stepForward = ()=>{
    console.log('vpered')
}*/

const componentData ={
    template:  template(),
    data: function () {
      return {
          urls: [1,2,3]
      }
    },
    compiled: function () {
        console.log(this)
    },
    mounted: function () {

        //console.log(this.$el)
    }

}


//export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default componentData;
