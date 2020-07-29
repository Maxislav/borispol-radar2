import Vue from 'vue';
import ToastHtml from './toast.component.html';
export const ToastComponent = Vue.component('toast-component', {
    template: ToastHtml,
    data: function () {

        // console.log(this.$toast)

        return{
            toastList: []
        }
    }
});
