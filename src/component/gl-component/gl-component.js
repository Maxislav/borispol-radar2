import Vue from 'vue';

import template from './gl-component.html';
import {mounted} from './mounted-service'

export const GLComponent = Vue.component('gl-component', {
    template: template,
    data() {
        return {}
    },
    mounted() {
        const h = this.$el.parentElement.clientHeight;
        const w = this.$el.parentElement.clientWidth;
        const canvas = this.$el.getElementsByTagName('canvas').item(0);
        canvas.width = 500;
        canvas.height = 479;
        mounted(canvas)

    }
});

