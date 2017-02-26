import Vue from 'vue';
import  img64loader from "base64-image-loader!../img/loader.png";
import templateLoader from "./loader.jade";
import './directive-img.styl'
//import loaderComponent from "../component/loader-component/loader-component"
//console.log(loaderComponent.$el)



Node.prototype.$fadeTo = function (from, to, delay, callback) {

    this.style.opacity = from + '';
    this.style.transition = 'opacity ' + (delay) + 'ms';
    setTimeout(() => {
        this.style.opacity = to + ''
    }, 10);

    return new Promise((resolve) => {
        setTimeout(() => {
            callback && callback(this);
            resolve(this)
        }, delay - 10);

    });
};

export default Vue.directive('img', {
    inserted: function (el, binding) {


        const loaderDiv = document.createElement('div');
        loaderDiv.innerHTML = templateLoader({loader:img64loader});
        console.log(loaderDiv.children[0]);

        el.style.position = 'relative';
        const imgLoader = loaderDiv.children[0];
        el.$fadeTo();
       // imgLoader.src = img64loader;
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

        imgNeeded.onload = () => {
            el.appendChild(imgNeeded)

            
            imgNeeded.$fadeTo(0, 1, 222)
                .then(d=>{
                    imgLoader.$fadeTo(1, 0, 222)
                        .then(d => {
                            el.removeChild(imgLoader)
                        });
                })

        };
        console.log(binding.value);
        imgNeeded.src = binding.value

    }

});