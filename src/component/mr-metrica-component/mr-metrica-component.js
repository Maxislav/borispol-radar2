import Vue from 'vue';
import template from './mr-metrica-component.pug'
import {socket} from "../../service/socket";
import  './mr-metrica-component.styl'

const user ={
    online: 0
};

socket.onConnect()
    .then(socket =>{
        socket.on('online', count =>{

            user.online = count
        })
    })

export const MetricaComponent = Vue.component('metrica-component',{
    template: template(),
    data: function () {
        return {
           user
        }

    }
})