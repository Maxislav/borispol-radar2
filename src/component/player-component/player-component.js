import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import '../../font-awesome/scss/font-awesome.scss';
import {Deferred} from '../../util/deferred';
import {autobind, enumerable, extendDescriptor, lazyInitialize} from 'core-decorators';


export class Player {
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
	constructor(d) {
		this.prefix = d ? d.prefix : '';
		this.suffix = d ? d.suffix : '';
		if (d && d.variables) {
			d.variables.forEach(i => this.variables.push(i))
		}
	}


	@autobind
	play() {
		if (!this.images) {
			this.images = [];
			const urls = this.variables.map(it => this.prefix + it + this.suffix);
			this._loadImages(urls)
		}
		return this.deferImages.promise
			.then(d => {
				console.log(d)
			})
	}

	@autobind
	back() {

	}

	@autobind
	forward() {

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

				resolve(vueEl);
				//document.body.removeChild(img);
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
		return Promise.all(urls.map((url, i) => this._loadImage(url)))
			.then(arr => {
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


					img.$fadeTo(0, 1, 222);


					this.stage.appendChild(img)
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