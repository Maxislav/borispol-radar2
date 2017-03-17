import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';
import {Deferred} from '../../util/deferred';
import {autobind, enumerable, extendDescriptor, lazyInitialize} from 'core-decorators';


export class Player {
	/**
	 *
	 * @type {boolean}
	 */
	process = false

	/**
	 * @type {Node}
	 */
	stage;

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
	 * @type {Array.<HTMLElement>}
	 */
	images = [];

	/**
	 *
	 * @type {Deferred}
	 */
	deferImages = new Deferred();

	/**
	 *
	 * @type {number}
	 */
	k = 0;

	/**
	 *
	 * @type {Array.<string>}
	 */
	urls = []



	/**
	 *
	 * @param {{prefix: string, suffix: string, variables: Array.<string>}} d
	 */
	constructor(d) {
		this.prefix = d ? d.prefix : '';
		this.suffix = d ? d.suffix : '';
		if (d && d.variables) {
			d.variables.forEach(i => this.variables.push(i))
		}
		this.urls = this.variables.map(it => this.prefix + it + this.suffix);
	}

	@autobind
	play(e) {
		if(this.process) return;
		this.process = true;
		if (this.images.length<this.urls.length) {

			this._loadImages(this.urls)
			return this.deferImages.promise
				.then(d => {
					console.log(this.images)
					this.process = false;
					this.play(e)
				})
		}else{
			this.images.map(img=>img.$fadeTo(0,1, 222));
			this.k = this.images.length-1;
			this.process = true;
			this.forward(e,true)
		}
	}

	@autobind
	back() {

		if (this.images && this.images[this.k+1]) {
			this.k++;
			this.images[this.k].$fadeTo(0, 1, 500)
		} else if(this.k<this.variables.length){
			this._loadImage(this.urls[this.k+1], this.k+1)
				.then(d=>{
					this.back()
				})

		}
	}

	@autobind
	forward(e,play) {
		if(this.images[this.k]){
			this.images[this.k].$fadeTo(1,0,500,0.5)
				.then(d=>{
					this.k--
					if(this.k && play){
						this.forward(e,play)
					}else {
						this.process = false
					}
				})
		}else{
			this.k++
		}
	}

	/**
	 *
	 * @param {string} url
	 * @param {Number} i
	 * @returns {Promise.<Image>}
	 * @private
	 */
	_loadImage(url, i) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.style.display = 'none';
			img.onload = () => {
				const styleImg = {
					position: 'absolute',
					top: 0,
					display: 'block',
					left: 0,
					opacity: 0,
					'z-index': i + 1
				};

				img.setAttribute('v-bind:style', "styleImg");
				const vueEl = new Vue({
					el: img,
					data: {
						styleImg
					}
				}).$el;
				this.images = this.images || []
				this.images[i] = vueEl;
				this.stage.appendChild(vueEl)
				resolve(vueEl);
			};
			img.onerror = () => {
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
	_loadImages(urls) {
		return Promise.all(urls.map((url, i) => this._loadImage(url,i)))
			.then(arr => {
				//arr.map((img, i) => this.images[i] =img)
				return this._applyToStage(arr)
			})
			.then(arr => {
				this.deferImages.resolve(arr);
				return arr;
			})
	}

	/**
	 *
	 * @param {Array.<Image>} arr
	 * @returns {Promise}
	 * @private
	 */
	_applyToStage(arr) {
		return new Promise(resolve => {
			if (this.stage) {
				arr.forEach((img, i) => {
					//this.stage.appendChild(img)
				})
			}
			resolve(arr)
		})
	}

	/**
	 *
	 * @param type
	 * @returns {HTMLElement}
	 * @private
	 */
	_getDiv(type) {
		const node = document.createElement(type)
		node.setAttribute('class', 'img-sat')
		node.style.position = 'relative';
		return new Vue({
			el: node
		}).$el
	}

}
const dataComponent = {
	template: template(),
	props: ['prefix', 'suffix', 'variables'],
	data: function (e, a) {


		const player = this.player = new Player({
			prefix: this.prefix,
			suffix: this.suffix,
			variables: this.variables,
		});

		return {
			onPlay: player.play,
			onBack: player.back,
			onForward: player.forward
		}
	},
	mounted: function () {
		const container = this.$el.parentNode.children[0];

		this.player.stage = container
	}
};


export default Vue.component('player-component', dataComponent)