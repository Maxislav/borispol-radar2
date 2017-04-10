import Vue from 'vue';
import  './directive-random-background.styl';

const rand = Math.getRandom(1,8 , true);
export const bg = new Vue({
    data: {
        src:  './img/bg/'+rand+'.jpg'
    }
});


export default  Vue.directive('random-background', {
    inserted: function (el, binding){
        const img = new Image();

	      img.style.opacity = 0;
        const startLoad = (src)=>{
	        img.onload = ()=>{
		        img.$fadeTo(0,1,500).then();
		        el.appendChild(img)
	        };
	        img.src = src;
        };
        startLoad(bg.src);
        bg.$watch(()=>bg.src, (val)=>{
          img.$fadeTo(1,0,222)
            .then(img=>{
	            startLoad(val)
            })
        })
    }
});
