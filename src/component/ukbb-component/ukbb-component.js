import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';

const UkbbComponent = Vue.component('ukbb-component',{
	template:  template(),
	compiled: function () {
		console.log(this)
	},
	mounted: function () {

		console.log(this.$el)
	}

});
//const UkbbComponent ={template:  template()}

export default UkbbComponent;
