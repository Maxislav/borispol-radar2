import Vue from 'vue';
import template from './strip-loader.jade';
import './strip-loader.styl'



export default Vue.component('strip-loader', {
    template: template(),
    props: ['load'],
    data: function () {

        return {
            opacity: 0.5
        }
    },
    computed: {
        width: {
            get: function () {
                return this.load+'%'
            }
        },

    },
    watch:{
        load: function () {
            if(0<this.load && this.load<99){
                this.opacity = 1
            }else{
                this.opacity =0
            }
        }
    }

})
