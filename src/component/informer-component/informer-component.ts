import {borispolComponent} from '../../util/borispol-component';
import template from './informer-component.html'
import style from './informer-component.less'
let loaded = false;
export const informerComponent = borispolComponent('informer-component' ,{
    template,
    style,
    mounted(): void {
            (function() {
                const d = this.document,
                    o = this.navigator.userAgent.match(/MSIE (6|7|8)/) ? true : false,
                    s = d.createElement('script');

                s.src  = 'https://www.gismeteo.ua/api/informer/getinformer/?hash=Qmw1fy8cwa3o0A';
                s.type = 'text/javascript';
                s[(o ? 'defer' : 'async')] = true;
                s[(o ? 'onreadystatechange' : 'onload')] = function() {

                };

                d.body.appendChild(s)
                if(!loaded){
                    const link = d.createElement('link');
                    link.setAttribute('rel', 'stylesheet');
                    link.setAttribute('type', 'text/css');
                    link.setAttribute('href', 'https://www.gismeteo.ua/assets/flat-ui/legacy/css/informer.min.css');
                    d.head.appendChild(link);
                    loaded = true
                }

            }).call(window);

    },
});
