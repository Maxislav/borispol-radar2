import { ToastComponent } from "./component/toast.component";

export const ToastPlugin = {
    install: function (Vue, options) {
        class Toast {
            toastList = [];
            constructor() {
            }
        };
        const t = new Toast();
        const containet = document.createElement('div');
        document.body.appendChild(containet);

        setTimeout(()=>{
            new ToastComponent({
                el: containet
            });

        },1);


        Object.defineProperties(Vue.prototype, {
            $toast: {
                get: () => {
                    return t
                }
            }
        })
    }
};
