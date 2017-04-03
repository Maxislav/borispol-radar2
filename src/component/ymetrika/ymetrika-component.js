import Vue from 'vue';
import template from './ymetrika-component.pug';
import './ymetrika-component.styl';

const YmetrikaComponent = Vue.component('ymetrika-component', {
    template: NODE_ENV == 'dev' ? '<div class="ymetrika-component"></div>' : template(),
    mounted: function () {


        if(NODE_ENV == 'dev' ) return;

        this.$http.get('config.json')
            .then(d=>{

                const permits = {
                    id: d.data['y-metrika'],
                    allow: [
                        'borispol',
                        'senko'
                    ]
                };

              this.$el.innerHTML = template({href: `http://metrika.yandex.ru/stat/?id=${permits.id}&amp;from=informer` });

                ((d, w, c) => {
                    const rex = new RegExp(permits.allow.join('|'));
                    if (!window.location.origin.match(rex)) {
                        return
                    }


                    const dNscr = document
                        .createElement('noscript')
                        .appendChild(document
                            .createElement('div'));
                    this.$el.appendChild(dNscr);
                    dNscr.setAttribute('class', 'y-watch');


                    const imgYm = new Image();
                    imgYm.src = "//mc.yandex.ru/watch/" + permits.id;
                    imgYm.style.position = 'absolute';
                    imgYm.style.left = '-9999px';
                    dNscr.appendChild(imgYm);

                    (w[c] = w[c] || []).push(function () {
                        try {
                            w['yaCounter' + permits.id] = new Ya.Metrika({
                                id: permits.id,
                                clickmap: true,
                                trackLinks: true,
                                accurateTrackBounce: true,
                                trackHash: true
                            });
                        } catch (e) {
                        }
                    });

                    const n = d.getElementsByTagName("script")[0],
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
            });



    }
});
export  default YmetrikaComponent
