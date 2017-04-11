import Vue from 'vue';
import template from './infomometr-component.pug';
import './infomometr-component.styl';
import {Deferred} from '../../util/deferred'

class ScriptLoad{
	constructor(){
		/**
		 * @type {Deferred}
		 */
		this.meteoUaDefer = null;
		this.el = null;

		this._linksDefer = {};
		this._content = null;
		this._children = [];


	}
	setEl(el){
		this.el = el;
		return this
	}

	load(src){
		if(!this._linksDefer[src]){
			this._linksDefer[src] = new Deferred();
			const script = document.createElement('script');
			script.setAttribute('type',"text/javascript");
			script.onload = ()=>{
				this._linksDefer[src].resolve(script)
			};
			script.src = src;
			this.el.appendChild(script)

		}
		return this._linksDefer[src].promise
	}

	css(src){
		if(!this._linksDefer[src]){
			this._linksDefer[src] = new Deferred();
			const link  = document.createElement('link')
			link.setAttribute('rel',"stylesheet");
			link.setAttribute('type',"text/css");
			link.setAttribute('href',src);
			document.head.appendChild(link);
			this._linksDefer[src].resolve(link)
		}
		return this._linksDefer[src].promise
	}
	getContent(){
		return this._children
	}

	setContent(el){

		Array.prototype.forEach.call(el.children, item=>{
			this._children.unshift(item.cloneNode(true))
		});

	}

}

const scriptLoad = new ScriptLoad();


export const InfomometrComponent = Vue.component('infomometr-component', {
	template: template(),
	data: function () {

		return {

		}
	},
	beforeMount: function () {
		scriptLoad.el = this.$el;
	},
	mounted: function () {


		if(scriptLoad.getContent().length){
			this.$el.innerHTML = ''
			scriptLoad.getContent().forEach(child=>{
				this.$el.appendChild(child)
			})
		}else {
			scriptLoad
				.setEl(this.$el);
			scriptLoad
				.load('http://meteo.ua/var/informers.js')
				.then(script=>{
					window['makeMeteoInformer']("http://meteo.ua/informer/get.php?cities=34&w=320&lang=ru&rnd=1&or=vert&clr=0&dt=today&style=classic",320,150);
				});

			scriptLoad
				.load('https://www.gismeteo.ua/ajax/getInformer/?hash=74y4607L4vnNV6')
				.then(script=>{

				});

			scriptLoad
				.css('https://s1.gismeteo.ua/static/css/informer2/gs_informerClient.min.css');

			setTimeout(()=>{
				scriptLoad.setContent(this.$el)
			},4000)
		}


	}
});



