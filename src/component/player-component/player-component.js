import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import {Deferred} from '../../util/deferred';
import {autobind, enumerable, extendDescriptor, lazyInitialize} from 'core-decorators';

/**
 *  @class
 */
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
	 * @type {Array.<string>}
	 */
	urls = []

    /**
     *
     * @type {boolean}
     * @private
     */
    _process = false;
    /**
	 *
     * @param {boolean}val
     */
	set process(val){
        this._component.process = val;
        this._process = val
	}

    /**
     * @returns {boolean}
     */
	get process(){
		return this._process
	}

	set k(val){
		this._k = val
	}
	get k(){
		return this._k
	}

    /**
	 *
     * @param {Number}val
     */
	set load(val){
		this._component.onload(100*(this._load+1)/this.variables.length);
		this._load = val
	}

    /**
	 *
     * @returns {Number}
     */
	get load(){
		return this._load
	}

	/**
	 *
	 * @param {Vue} component
	 * @param {Function} component.onload
	 * @param {{prefix: string, suffix: string, variables: Array.<string>}} d
	 */

	constructor(component, d) {
		this._component = component;
        this._k = 0;
        this._load = 0
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

			this._loadImages(this.urls).then(d=>{});
			return this.deferImages.promise
				.then(d => {
					this.process = false;
					this.play(e)
				})
		}else{
			Promise.all(this.images.map(img => {
				return img.$fadeTo(0, 1, 1000)
			}))
				.then(d => {
					return new Promise(resolve=>{
						setTimeout(()=>{
							this.k = this.images.length - 1;
							this.forward(e, true)
							resolve(d)
						}, 500)
					})

				})
		}
	}

	@autobind
	back() {
		if (this.images && this.images[this.k+1]) {
			this.k++;
			//this.images[this.k].style.display = 'block'
			this.images[this.k].$fadeTo(0, 1, 500)
		} else if(this.k<this.variables.length){
			this._loadImage(this.urls[this.k+1], this.k+1)
				.then(d=>{
					this.back()
				})

		}
	}

	@autobind
	forward(e, play) {
		console.log(this.k)
		if(this.images[this.k]){

			this.images[this.k].$fadeTo(1,0,1600,0.2)
				.then(d=>{
					this.k--;
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

            const vueEl = Player._getEl(i)

            const onload = (i, display)=>{
                this.images = this.images || [];

                this.images[i] = vueEl;
                this.images[i].style.display = display
                this.stage.appendChild(vueEl)
                resolve(vueEl);
                this.load++;
            }

            vueEl.onerror = ()=>{
                onload(i, 'none')
            }
            vueEl.onload = ()=>{
                onload(i, 'block')
            };


            vueEl.src = url;
		})
	}

	/**
	 *
	 * @param {Array.<string>}urls
	 * @returns {Promise.<Array.<HTMLElement>>}
	 * @private
	 */
	_loadImages(urls) {
		return Promise.all(urls.map((url, i) => this._loadImage(url,i)))
			.then(arr => {
				console.log(arr)
				this.deferImages.resolve(arr);
				return arr;
			})
	}

    /**
     * @param {Number}i
     * @returns {HTMLElement}
     * @private
     */
	static _getEl(i) {
        const img = new Image();
        img.setAttribute('v-bind:style', "styleImg");
        const styleImg = {
            position: 'absolute',
            top: 0,
            display: 'none',
            left: 0,
            opacity: 0,
            'z-index': i + 1
        };
        return new Vue({
            el: img,
            data: {
                styleImg
            }
        }).$el;

	}

}
const dataComponent = {
	template: template(),
	props: ['prefix', 'suffix', 'variables', 'onload'],
	data: function (e, a) {


		const player = this.player = new Player(this, {
			prefix: this.prefix,
			suffix: this.suffix,
			variables: this.variables,
		});

		return {
			process: player.process,
			onPlay: player.play,
			onBack: player.back,
			onForward: player.forward
		}
	},
	mounted: function () {
		this.player.stage = this.$el.parentNode.children[0];
	},
	computed: {
        processColor: {
        	get: function () {
				return this.process ? 'gray' :'black'
            }
		}
	},
	watch: {
        process: function(){
        	//console.log(this.process)

		}
	}
};


export default Vue.component('player-component', dataComponent)