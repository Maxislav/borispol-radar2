import Vue from 'vue';
import  img64loader from "base64-image-loader!../img/loader.png";
import templateLoader from "./loader.jade";
import './directive-img.styl'


export default Vue.directive('img', {
    inserted: function (el, binding) {

       //console.log(binding.value.$watch);


        const loaderDiv = document.createElement('div');
        loaderDiv.innerHTML = templateLoader({loader:img64loader});

        el.style.position = 'relative';
        const imgLoader = loaderDiv.children[0];
        el.$fadeTo();
        imgLoader.style.opacity = '0';
        imgLoader.style.position = 'absolute';
        imgLoader.style.top = '0'
        imgLoader.style.left = '0'
        imgLoader.style.zIndex = '1'
        el.appendChild(imgLoader);
        imgLoader.$fadeTo(0, 1, 222);


        const imgNeeded = new Image();
        imgNeeded.style.position = 'absolute';
        imgNeeded.style.top = '0'
        imgNeeded.style.left = '0'
        imgNeeded.style.opacity = '0';
        imgNeeded.style.zIndex = '0';

        let isAppend = false;

        imgNeeded.onload = () => {


	          !isAppend  && el.appendChild(imgNeeded);
            if(binding.value && binding.value.callback){
	            binding.value.callback(imgNeeded)
            }
            if(!isAppend){
	            imgNeeded.$fadeTo(0, 1, 222)
		            .then(d=>{
			            imgLoader.$fadeTo(1, 0, 222)
				            .then(imgLoader => {
					            el.removeChild(imgLoader)
				            });
		            });
              isAppend = true
            }else {
	            /*imgNeeded.$fadeTo(1,0, 100)
                .then(d=>{
	                imgNeeded.$fadeTo(0,1, 100).then()
                })*/
            }
        };



      if(typeof binding.value === 'object'){
	      imgNeeded.src = binding.value.src;

	      binding.value.$watch('src', (val)=>{
		      imgNeeded.src  = val;
        })

      }else{
	      imgNeeded.src = binding.value;
      }
	    //binding.

    }

});