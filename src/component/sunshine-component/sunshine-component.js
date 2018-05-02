import Vue from 'vue';
import template from './sunshine-component.pug';
import './sunshine-component.styl';
export const SunshineComponent = Vue.component('sunshine-component', {
    template: template(),
    data: function () {
        return {}
    },
    mounted: function (e) {
        console.log(this.$el)
        const width = this.$el.clientWidth
        const height = this.$el.clientHeight
        const canvas = this.$el.getElementsByTagName('canvas').item(0)
        canvas.width  = width
        canvas.height  = height
        const ctx =  canvas.getContext('2d');


        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2)

        gradient.addColorStop(0, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.02, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.022, 'rgb(255, 255, 255)');
        gradient.addColorStop(0.06, 'rgb(180, 220, 255)');
        gradient.addColorStop(0.5, 'rgb(160, 210, 255)');
        gradient.addColorStop(1, 'rgb(77, 134, 255)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    },
})

