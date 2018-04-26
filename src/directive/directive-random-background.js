import Vue from 'vue';
import './directive-random-background.styl';
import {getImage} from '../util/load-image-blob'

const rand = Math.getRandom(1, 8, true);
export const bg = new Vue({
    data: {
        src: './img/bg/' + rand + '.jpg'
    }
});


export default Vue.directive('random-background', {
    inserted: function (el, binding) {
        let image;

        const onLoad = (img) => {
            img.style.opacity = 0;
            el.appendChild(img);
            image = img;
            img.$fadeTo(0, 1, 2000).then();
        }

        const onUpdate = (img) => {
            img.style.opacity = 0;
            image.$fadeTo(1, 0, 222)
                .then(d => {
                    el.removeChild(image)
                    image = img
                    el.appendChild(image)
                    img.$fadeTo(0, 1, 500).then();


                })
        };


        //radial-gradient(at center center, rgb(115, 111, 126) 0px, rgb(101, 98, 119) 70%, rgb(65, 67, 92) 80%, rgb(8, 8, 8) 100%)
        //Ночь
        const rgb0 = [
            {r: 115, g: 111, b: 126},
            {r: 101, g: 98, b: 119},
            {r: 65, g: 67, b: 92},
            {r: 8, g: 8, b: 8},
        ];

        //radial-gradient(at center center, rgb(255, 255, 255) 0px, rgb(242, 255, 195) 70%, rgb(214, 181, 181) 80%, rgb(69, 49, 212) 100%)
        // утро
        const rgb1 = [
            {r: 255, g: 255, b: 255},
            {r: 242, g: 255, b: 195},
            {r: 214, g: 181, b: 181},
            {r: 69, g: 49, b: 212},
        ];

        //день
        const rgb2 = [
            {r: 255, g: 255, b: 255},
            {r: 244, g: 253, b: 237},
            {r: 232, g: 249, b: 180},
            {r: 96, g: 212, b: 86},
        ];


        const setStyle = (c) => {
            el.style.background = `radial-gradient(ellipse at center, 
            rgb(${c[0].r}, ${c[0].g}, ${c[0].b}) 0,
            rgb(${c[1].r}, ${c[1].g}, ${c[1].b}) 70%, 
            rgb(${c[2].r}, ${c[2].g}, ${c[2].b}) 80%, 
            rgb(${c[3].r}, ${c[3].g}, ${c[3].b}) 100%)`
        };


        bg.$watch(() => bg.src, (val) => {

            getImage(val)
                .then(onUpdate)


        });

        const d = new Date()

        const startDayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())


        const k = 360 / (3600 * 24)
        const elapseTime = (Date.now() - startDayDate.getTime()) / 1000
        let a = k * elapseTime - 90; //угол 0 - 180

        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const yearDays = (new Date(d.getFullYear(),11,31) - new Date(d.getFullYear(),0,0))/86400000;
        const t = 23.45*Math.sin(Math.radians(360*(284+dayOfYear)/yearDays));

        console.log(t)


        if (-t < a && a < 180+t) {
            let p;
            if (a < 90) {
                p = a / 90
            } else {
                p = Math.abs(180 - a) / 90
            }

            p+=(t/90)
            console.log(p)
            const c = rgb1.map((color1, index) => {
                const color2 = rgb2[index];
                const res = {};
                ['r', 'g', 'b'].map(key => {
                    res[key] = parseInt((color2[key] - color1[key]) * p + color1[key]);
                });

                return res
            });
            setStyle(c)
        } else {
            setStyle(rgb0)
        }

        getImage(bg.src)
            .then(onLoad)


    }
});
