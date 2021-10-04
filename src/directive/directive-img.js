import Vue from 'vue';
import img64loader from "base64-image-loader!../img/loader.png";
import templateLoader from "./loader.jade";
import './directive-img.styl';
import {getImage} from '../util/load-image-blob'

function removeStyle(name) {
    let style = this.getAttribute('style');
    const rex = new RegExp(name.concat(':\\s+?.+?;'));
    if (style) {
        style = style.replace(rex, '')
    }
    this.setAttribute('style', style)
}

export default Vue.directive('img', {
    inserted: function (el, binding) {
        const loaderDiv = document.createElement('div');
        loaderDiv.innerHTML = templateLoader({loader: img64loader});

        el.style.position = 'relative';
        const imgLoader = loaderDiv.children[0];
        el.$fadeTo();
        imgLoader.style.opacity = '0';
        imgLoader.style.position = 'absolute';
        imgLoader.style.top = '0';
        imgLoader.style.left = '0';
        imgLoader.style.zIndex = '1';
        imgLoader.classList.toggle ('loaderddd', true);
        el.appendChild(imgLoader);
        imgLoader.$fadeTo(0, 1, 222);


        let imgNeeded = new Image();
        imgNeeded.style.position = 'absolute';
        imgNeeded.style.top = '0';
        imgNeeded.style.left = '0';
        imgNeeded.style.opacity = '0';
        imgNeeded.style.zIndex = '0';

        let isAppend = false;


        const onLoad = (_imgNeeded) => {

            if (!isAppend) {
                el.appendChild(_imgNeeded);
                imgNeeded = _imgNeeded;
            } else {
                el.removeChild(imgNeeded);
                el.appendChild(_imgNeeded);
                imgNeeded = _imgNeeded;
            }


            if (!isAppend) {
                _imgNeeded.$fadeTo(0, 1, 222)
                    .then(d => {
                        imgLoader.$fadeTo(1, 0, 222)
                            .then(imgLoader => {
                                el.removeChild(imgLoader)
                                //removeStyle.call(el, 'position')
                                removeStyle.call(_imgNeeded, 'position')

                            });
                    });
                isAppend = true
            } else {

            }
            if (binding.value && binding.value.callback) {
                binding.value.callback(_imgNeeded)
            }
        };

        const onerror = (e) => {
            const div = document.createElement('div')
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.height = '100%';


            el.appendChild(div);
            div.innerHTML = 'Not Found'
            imgLoader.$fadeTo(1, 0, 222)
                .then(imgLoader => {
                    el.removeChild(imgLoader)
                })
        };


        imgNeeded.onload = () => {
            onLoad(imgNeeded)
        };


        if (typeof binding.value === 'object') {
            getImage(binding.value.src)
                .then(d => {
                    onLoad(d)
                })
                .catch(e => {
                    binding.value
                    if (binding.value.onerror) {
                        binding.value.onerror(e)
                    }
                    onerror(e)
                });

            binding.value.$watch('src', (val) => {
                console.log(val)
                getImage(val)
                    .then(d => {
                        onLoad(d)
                    });
            })

        } else {
            imgNeeded.src = binding.value;
        }
        //binding.

    }

});
