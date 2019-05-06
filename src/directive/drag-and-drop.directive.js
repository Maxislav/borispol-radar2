import Vue from 'vue';
import {getWindowSize} from "../util/position";
const scopeList = [];
function createScope(el){
    const scope = {
        el: el,
        scope: {
            events: []
        },
        remove(){
            this.scope.events.forEach(ev => ev.remove());
            removeScope(el)
        }
    };

    scopeList.push(scope)
}

function getScope(el){
    return scopeList.find(it => it.el === el).scope
}

function removeScope(el){
    const index = scopeList.findIndex(it => it.el === el);
    if(-1<index){
        scopeList.split(index, 1)
    }
}

Vue.directive('drag-and-drop', {
    bind(el){
        el.style.visibility = 'hidden';
        createScope(el)
    },
    inserted(el, binding, vnode) {

        const scope = getScope(el);


        el.style.visibility = 'visible';
        const windwSize = getWindowSize();
        const elSize = (() =>{
            return {
                width: el.offsetWidth,
                height: el.offsetHeight
            }
        })();
        const elXY = {
            x: 0,
            y: 0
        };

        const elXYOnDown = {
            x: 0,
            y: 0
        };

        function setElPosition(elXY) {
            el.style.left = String(elXY.x).concat('px');
            el.style.top = String(elXY.y).concat('px')
        }

        if(elSize.width<windwSize.width){
            Object.assign(elXY, {x:(windwSize.width - elSize.width) / 2});
        }
        if(elSize.height<windwSize.height){
            Object.assign(elXY, {y: (windwSize.height - elSize.height) / 2});
        }
        setElPosition(elXY);
        const mouseXY = {};
        let isDown = false;

        scope.events.push((()=>{
          function mouseDown(e) {
              e.preventDefault();
              isDown = true;
              Object.assign(elXYOnDown, elXY);
              return false
          }
          el.addEventListener('mousedown', mouseDown);
          return {
              remove: () =>{
                  el.removeEventListener('mousedown', mouseDown);
              }
          }
        })());

        scope.events.push((()=>{
            function mouseMove(e) {
                if(!isDown){
                    Object.assign(mouseXY, {
                        x: e.clientX,
                        y: e.clientY,
                    })
                }else{
                    const dXY = {x: 0, y: 0};

                    if(elSize.width<windwSize.width){
                        Object.assign(dXY,{
                            x: e.clientX - mouseXY.x
                        });
                        Object.assign(elXY, {
                            x: elXYOnDown.x + dXY.x,
                        });
                    }

                    if(elSize.height<windwSize.height){
                        Object.assign(dXY,{
                            y: e.clientY - mouseXY.y
                        });
                        Object.assign(elXY, {
                            y: elXYOnDown.y + dXY.y
                        });
                    }
                    setElPosition(elXY);
                }
            }
            document.body.addEventListener('mousemove', mouseMove);

            return {
                remove: () => {
                    document.body.removeEventListener('mousemove', mouseMove)
                }
            }
        })());

        scope.events.push((()=>{

            function mouseUp() {
                isDown = false;
            }
            document.body.addEventListener('mouseup', mouseUp);
            return {
                remove: () =>{
                    document.body.removeEventListener('mouseup', mouseUp);
                }
            }


        })())

       // el.addEventListener('mousedown', mouseDown);
        //el.addEventListener('mouseup', mouseUp);
       // document.body.addEventListener('mousemove', mouseMove)
    },
    unbind: function (el) {

        getScope(el).remove();
       /* console.log('unbund')
        el.removeEventListener('mousedown', mouseDown);
        el.removeEventListener('mouseup', mouseUp);
        document.body.removeEventListener('mousemove', mouseMove)*/

    }
});