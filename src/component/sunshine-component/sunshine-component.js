import Vue from 'vue';
import template from './sunshine-component.pug';
import './sunshine-component.styl';

const d = new Date()
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);
const yearDays = (new Date(d.getFullYear(),11,31) - new Date(d.getFullYear(),0,0))/86400000;
const t = 23.45*Math.sin(Math.radians(360*(284+dayOfYear)/yearDays));



export const SunshineComponent = Vue.component('sunshine-component', {
    template: template(),
    data: function () {
        return {}
    },
    mounted: function (e) {


        console.log(this.$el)
        const width = this.$el.clientWidth
        const height = this.$el.clientHeight
        const R = width/2*0.75

        const dT = R*t/50;
        console.log(dT)


        const canvas = this.$el.getElementsByTagName('canvas').item(0)
        canvas.width  = width
        canvas.height  = height
        const ctx =  canvas.getContext('2d');
        let cX, cY, sX, sY; //center x, centre y, start x, start y;
        sX = width/2;
        sY = height-dT;

        const angle = 360/(24 * 3600) * ((new Date().getHours()) *3600 + new Date().getMinutes()*60 + new Date().getSeconds());
        let dx = 0, dy = 0;
        if(angle < 90){
            dy = -Math.sin(Math.radians(angle-270))*R;
            dx =  Math.cos(Math.radians(angle-270))*R;
            cX = sX + dx;
            cY = sY - dy;
        } else if(angle < 180){
            dx =  Math.cos(Math.radians(angle-270))*R;
            dy = Math.sin(Math.radians(angle-270))*R;
            cX = sX + dx;
            cY = sY + dy;
        } else if( angle < 270){
            dy = Math.sin(Math.radians(angle-270))*R;
            dx =  Math.cos(Math.radians(angle-270))*R;
            cX = sX + dx;
            cY = sY + dy;
        }else {
            dy = -Math.sin(Math.radians(angle-270))*R;
            dx =  Math.cos(Math.radians(angle-270))*R;
            cX = sX + dx;
            cY = sY - dy;
        }

        const gradient = ctx.createRadialGradient(cX,cY, 0, cX, cY, 1.6*width/2)
        gradient.addColorStop(0, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.02, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.022, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.06, 'rgb(180, 220, 255)');
        gradient.addColorStop(0.5, 'rgb(160, 210, 255)');
        gradient.addColorStop(1, 'rgb(77, 134, 255)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.arc(width/2, sY, R, 0, 2 * Math.PI, false)
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.setLineDash([15, 5]);
        ctx.stroke();



        console.log(angle)
    },
})

