import {borispolComponent} from '../../util/borispol-component';
import template from './informer-component.html'
import style from './informer-component.less'

export const informerComponent = borispolComponent('informer-component' ,{
    template,
    style,
    mounted(): void {
        (function() {
            const d = this.document,
                o = this.navigator.userAgent.match(/MSIE (6|7|8)/) ? true : false,
                s = d.createElement('script');
            s.src  = 'https://www.gismeteo.ua/informers/simple/install/';
            s.type = 'text/javascript';
            s[(o ? 'defer': 'async')] = true;
            s[(o ? 'onreadystatechange' : 'onload')] = function() {
                const GmI: any = window['GmI'];

                try {new GmI({
                    slug : 'f60fc683b425215be19ccbc52785a242',
                    type : '240x90-2',
                    city : '4944',
                    lang : 'ru',
                })} catch(e) {}
            };

            d.body.appendChild(s);
        }).call(window);
    },
});
