/**
 * Created by nastia on 20.03.17.
 */
import Vue from 'vue';
import './meteosat-component.styl'
import template from './meteosat-component.jade';
import dateFormat from 'dateformat';
import {urlCron} from '../../config/congig-url';
//import {autobind} from 'core-decorators';
import {autobind, enumerable, extendDescriptor} from 'core-decorators';


var variableUrls = [];
let namePrefix = "Sputn-";
for (let i = 1; i <= 24; i++){
    variableUrls.push(i < 10 ? namePrefix + "0" + i : namePrefix + i);
}

    //variableUrls.push(.tdateFormat(new Date()oUtc().getTime() - (i*3600*1000), 'yyyymmddHH00'))

console.log(variableUrls)

const MeteosatComponent = Vue.component('meteosat-component',{
    template:  template(),
    data: function () {
     //  const initSrc = urlCron.ir + dateFormat(new Date().toUtc(), 'yyyymmddHH00')+'.gif';

        return {
            initSrc: 'http://meteo.gov.ua/sputnik_map/Sputn-24.jpg',
            load: 0,
            onload: (val) =>{
                this.load = val
            },
            prefix : "http://meteo.gov.ua/sputnik_map/",
            variables: variableUrls,
            suffix : '.jpg',
        }
    },
    mounted: function (){
        //console.log(this.$el);
    }


});
//const UkbbComponent ={template:  template()}

export default MeteosatComponent;
