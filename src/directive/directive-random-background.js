import Vue from 'vue';
import  './directive-random-background.styl';
import {getImage} from '../util/load-image-blob'

const rand = Math.getRandom(1,8 , true);
export const bg = new Vue({
    data: {
        src:  './img/bg/'+rand+'.jpg'
    }
});


export default  Vue.directive('random-background', {
    inserted: function (el, binding){
        let image;

        const onLoad = (img)=>{
	        img.style.opacity = 0;
	        el.appendChild(img);
	        image = img;
	        img.$fadeTo(0,1,500).then();
        }

        const onUpdate = (img)=>{
	        img.style.opacity = 0;
	        image.$fadeTo(1,0,222)
		        .then(d=>{
			        el.removeChild(image)
			        image = img
			        el.appendChild(image)
			        img.$fadeTo(0,1,500).then();


		        })
        };
	      getImage(bg.src)
		      .then(onLoad);

        bg.$watch(()=>bg.src, (val)=>{

	        getImage(val)
		        .then(onUpdate)


        })
    }
});
