import Vue from 'vue';
import template from './player-component.jade';
import './player-component.styl'
import {Deferred} from '../../util/deferred';
import {autobind, enumerable, extendDescriptor, lazyInitialize} from 'core-decorators';
import {urlCron} from '../../config/congig-url'
import {f} from './player.ts'


/**
 *  @class
 */
export class Player {



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
		/**
		 * @type {Node}
		 */
		this.stage;

		/**
		 * @type {string}
		 */
		this.prefix = '';
		/**
		 * @type {string}
		 */
		this.suffix = '';

		/**
		 * @type {Array.<string>}
		 */
		this.variables;

		/**
		 *
		 * @type {Array.<HTMLElement>}
		 */
		this.images = [];

		/**
		 *
		 * @type {Deferred}
		 */
		this.deferImages = new Deferred();



		/**
		 *
		 * @type {Array.<string>}
		 */
		this.urls;

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._process = false;




		this._component = component;
        this._k = 0;
        this._load = 0;
		this.prefix = d ? d.prefix : '';
		this.suffix = d ? d.suffix : '';
		if (d && d.variables) {
			this.variables = d.variables
		}
		//this.urls = this.variables.map(it => this.prefix + it + this.suffix);
	}



	@autobind
	play(e) {
		if(this.process) return;
		this.process = true;
		this._fillUrls();


		if (this.images.length<this.urls.length) {

			this._loadImages(this.urls).then(d=>{});
			return this.deferImages.promise
				.then(d => {
					this.process = false;
					this.play(e)
				})
		}else{
			this._fadeAll().then(d=>{
				this.k = this.images.length - 1;
				this.forward(e, true)
			})
		}
	}



	@autobind
	back() {
		this._fillUrls();
		if (this.images && this.images[this.k+1]) {
			this.k++;
			//this.images[this.k].style.display = 'block'
			this.images[this.k].$fadeTo(0, 1, 1600)
		} else if(this.k<this.variables.length){
			this._loadImage(this.urls[this.k+1], this.k+1)
				.then(d=>{
					this.back()
				})

		}
	}

	@autobind
	forward(e, play) {
		this._fillUrls();
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

	_fillUrls(){
		if(!this.urls){
			this.urls = this.variables.map(it => this.prefix + it + this.suffix);
		}
	}


	/**
	 *
	 * @returns {Promise.<Array.<HTMLElement>>}
	 * @private
	 */
	_fadeAll(){
		return Promise.all(this.images.map(img => {
			return img.$fadeTo(0, 1, 1000)
		}))
			.then(d => {
				return new Promise(resolve=>{
					setTimeout(()=>{
						resolve(d)
					}, 500)
				})
			})
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
            };

            vueEl.onerror = ()=>{
                onload(i, 'none')
            };
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

class Player2 extends Player{



	constructor(...args){

		super(...args);
		/**
		 *
		 * @type {Deferred}
		 * @private
		 */

		this._deferHistory;


	}
	@autobind
	play(e){
		if(this.process) return;
		this.process = true;
		this._loadHistory()
			.then(d=>{
				this.process = false;
				super.play(e);
			})

	}
	@autobind
	back(e){
		this._loadHistory()
			.then(d=>{
				super.back(e)
			})
	}
	@autobind
	forward(e, auto){
		this._loadHistory()
			.then(d=>{
				super.forward(e, auto)
			})
	}

	_loadHistory(){
		if(!this._deferHistory){
			this._deferHistory = new Deferred();
			this._component.onload(10);
			Vue.http.get(urlCron['ukbb-history'])
				.then(d=>{
					this.variables = d.body;
					this._deferHistory.resolve( this.variables)
				})
		}
		return this._deferHistory.promise
	}


}



const palyerComponent = {
	template: template(),
	props: {
		'prefix': String,
		'suffix': String,
		'variables': Array,
		'onload': Function,
		'type': {
			type: Number,
			default: 1
		},
		'hideInitial':  HTMLElement
	},
	data: function (e, a) {

		//console.log(this.type)
		switch (this.type){
			case 2:
				this.player = new Player2(this, {
					prefix: this.prefix,
					suffix: this.suffix
				});
				break;
			default :
				this.player = new Player(this, {
				prefix: this.prefix,
				suffix: this.suffix,
				variables: this.variables,
			});

		}

		const player = this.player;
		const this$ = this;
		return {
			process: player.process,
			onPlay: player.play ,
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


export default Vue.component('player-component', palyerComponent)
