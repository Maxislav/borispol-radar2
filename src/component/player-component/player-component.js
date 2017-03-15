import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';
import {Deferred} from '../../util/deferred';
import {autobind} from 'core-decorators';


const dataComponent = {
	template: template(),
	props: ['play', 'back', 'forward'],
	data: function (e, a) {

		const back = this.back;
		const play = this.play;

		return {
			onPlay: (e) => {
				this.play(e)
			},
			onBack: (e)=>{
				back(e)
			},
			onForward: (e) => {
				this.forward(e)
			}
		}
	}
};

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
	 * @param {{prefix: string, suffix: string, variables: Array.<string>}} d
	 */
	constructor(d){
		this.prefix = d ? d.prefix : '';
		this.suffix = d ? d.suffix : '';
		if(d && d.variables){
			d.variables.forEach(i=>this.variables.push(i))
		}
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

export default Vue.component('player-component', dataComponent)