import Vue from 'vue';
import  './directive-random-background.styl';

export  default  Vue.directive('random-background', {
    inserted: function (el, binding){
        const img = new Image();

        const rand = Math.getRandom(1,8 , true);
        img.style.opacity = 0;

        img.onload = ()=>{
            img.$fadeTo(0,1,500).then();
            el.appendChild(img)
        };
        img.src = './img/bg/'+rand+'.jpg';
    }
});
