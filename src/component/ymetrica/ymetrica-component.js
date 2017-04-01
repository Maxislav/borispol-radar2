import Vue from 'vue';
import template from './ymetrica-component.pug';
import './ymetrica-component.styl';

const YmetricaComponent = Vue.component('ymetrica-component',{
    template: template(),
    mounted: function () {
       // console.log('ok');


         const permits ={
             id:23847604,
             allow: [
                 'borispol',
                 'senko'
             ]
         } ;


        ( (d, w, c)=> {
            const rex =  RegExp(permits.allow.join('|'));
            if (!window.location.origin.match(rex)){
                return
            }


                var dNscr =   document
                    .createElement('noscript')
                    .appendChild(document
                        .createElement('div'));
                this.$el.appendChild(dNscr);
                dNscr.setAttribute('class', 'y-watch');


                var imgYm = new Image();
                imgYm.src = "//mc.yandex.ru/watch/"+permits.id;
                imgYm.style.position = 'absolute';
                imgYm.style.left = '-9999px';
                dNscr.appendChild(imgYm);

                (w[c] = w[c] || []).push(function () {
                    try {
                        w['yaCounter'+permits.id] = new Ya.Metrika({id: permits.id,
                            clickmap: true,
                            trackLinks: true,
                            accurateTrackBounce: true,
                            trackHash: true
                        });
                    } catch (e) {
                    }
                });

                var n = d.getElementsByTagName("script")[0],
                    s = d.createElement("script"),
                    f = function () {
                        n.parentNode.insertBefore(s, n);
                    };
                s.type = "text/javascript";
                s.async = true;
                s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js";

                if (w.opera == "[object Opera]") {
                    d.addEventListener("DOMContentLoaded", f, false);
                } else {
                    f();
                }


        })(document, window, "yandex_metrika_callbacks");
    }
});
export  default YmetricaComponent
