import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';
import {Deferred} from '../../util/deferred';
import {autobind, enumerable, extendDescriptor, lazyInitialize} from 'core-decorators';

function kk(target, key, descriptor) {
	descriptor.configurable = true;
	descriptor.writable = true;
	descriptor.enumerable = true;
	const value = target[key]
	target[key] = value
	Object.defineProperty(target, key, {
		enumerable: true,
		value: function () {
			
		}
	})
	for(let key in target){
		console.log(key)
	}
	return descriptor;
}

function keys() {
	return function decorator(target) {



		return target
	}
}
@keys
export class Player{

	/**
	 * @type {string}
	 */
	prefix = '';
	/**
	 * @type {string}
	 */
	suffix = '';

	/**
	 * @type {Array.<string>}
	 */
	variables = [];

	/**
	 *
	 * @type {Array.<Image>}
	 */
	images;

	/**
	 *
	 * @type {Deferred}
	 */
	deferImages = new Deferred();

	/**
	 *
	 * @type {string}
	 */
	initSrc = '';

	/**
	 *
	 * @param {{prefix: string, suffix: string, variables: Array.<string>, initSrc: string}} d
	 */
	constructor(d){
		this.prefix = d ? d.prefix : '';
		this.suffix = d ? d.suffix : '';
		if(d && d.variables){
			d.variables.forEach(i=>this.variables.push(i))
		}
		this.initSrc = d.initSrc;
	}

	/**
	 *
	 * @param {string} url
	 * @returns {Promise.<Image>}
	 * @private
	 */
	_loadImage(url){
		return new Promise((resolve, reject)=>{
			const img = new Image();
			img.style.display = 'none';
			img.onload = ()=>{
				resolve(img);
				document.body.removeChild(img);
			};
			img.onerror = ()=>{
				resolve(null)
			};
			img.src = url;
			document.body.appendChild(img)
		})
	}

	/**
	 *
	 * @param {Array.<string>}urls
	 * @returns {Promise.<*>}
	 * @private
	 */
	_loadImages(urls){
		return Promise.all(urls.map(url=>this._loadImage(url)))
			.then(arr=>{
				this.deferImages.resolve(arr);
				return arr;
			})
	}

	@autobind
	@enumerable
	@kk
	play(){
		if(!this.images){
			this.images = [];
			const  urls = this.variables.map(it=>this.prefix+it+this.suffix);
			this._loadImages(urls)
		}
		return this.deferImages.promise
			.then(d=>{
				console.log(d)
			})
	}
	@autobind
	back(){

	}
	@autobind
	forward(){

	}
}
const dataComponent = {
	template: template(),
	props: ['play', 'back', 'forward'],
	data: function (e, a) {
		console.log(this.play)
		return {
			onPlay: this.play,
			onBack: this.back,
			onForward: this.forward
		}
	},
	mounted: function () {
		const container  = this.$el.parentNode
		console.log(container)
	}
};


export default Vue.component('player-component', dataComponent)