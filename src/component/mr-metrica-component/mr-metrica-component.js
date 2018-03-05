import Vue from 'vue';
import template from './mr-metrica-component.pug'
import {socket} from "../../service/socket";
import  './mr-metrica-component.styl';

import {create} from "../../util/local-storage";

const storage = create('user')




const user ={
    connection: 0,
    uniq: 0
};



class User{
    constructor(socket){
        socket.emit('keygen', ({
            key: storage.getItem('key') || null
        }))

        socket.on('uniq', ({uniq = 0, connection = 0})=>{
            user.uniq = uniq;
            user.connection = connection;
        })

        socket.on('keygen', ({key}) =>{
            storage.setItem('key', key)
        })
    }
}

socket.promise
    .then(socket =>{
        socket.on('connect', () =>{
            new User(socket)
        })
    })
    .catch(err=>{
        console.error(err)
    })

export const MetricaComponent = Vue.component('metrica-component',{
    template: template(),
    data: function () {
        return {
           user
        }

    }
})