import Vue from 'vue';
import template from './bookmark-component.jade';
import './bookmark-component.styl';

const BookmarkComponent = Vue.component('bookmark-component',{
	template: template(),
  destroyed: function() {

  },
	data: function() {
    const listIco = 	new Vue({
      data: {
        src:'img/icons8-xbox-menu.png'
      }
    });
    const data = {
      listIco,
      onMenu: function(e) {
      	e.stopPropagation();
        this.isMenuShow = !this.isMenuShow
      },
      isMenuShow: false
    };
    this.documentClick = (e) =>{
    	e.stopPropagation();
      if(data.isMenuShow) data.isMenuShow = false
    };
    document.addEventListener('click', this.documentClick);
		return data
  }
  ,
  computed:{
    currentLocation() {
      return this.$route.path
    },
  },
  watch: {
    currentLocation(newValue) {
      this.$data.isMenuShow = false
    }
  }


});
export  default BookmarkComponent
