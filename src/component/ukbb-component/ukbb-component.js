import Vue from 'vue';
import template from './ukbb-component.jade';
import './ukbb-component.styl';
import player from '../player-component/player-component'
//import { enumerable } from 'core-decorators';
import {Deferred} from '../../util/deferred'
import {autobind} from 'core-decorators';
//console.log(Deferred);


class Ukbb {

	/**
	 *
	 * @type {Array<string>|null}
	 */
	urls = null;
	/**
	 * @type { Deferred|null}
	 */
	historyDefer = null;


	constructor() {

	}

	loadHistory() {
		if (!this.historyDefer) {
			this.historyDefer = new Deferred();
			Vue.http.get('php/loadUkbbHistory.php')
				.then(d => {


					if (Array.isArray(d.data)) {
						this.urls = d.data.filter(item => item != null);
						return this.historyDefer.resolve(this.urls)
					} else {
						return Promise.reject('is not Array')
					}
				})
				.catch(err => {
					console.error(err)
					return err
				})
		}

		return this.historyDefer.promise
	}

	@autobind
	play() {
		console.log('1',this.urls)
		if (!this.urls.length) {
			this.loadHistory()
				.then(urls => {
					console.log('2',urls)
					if(urls.length){
						this.play()
					}

				})
				.catch(err => {
					console.error(err)
				})
		}

	}

	back() {

	}

	forward() {

	}

}

const componentData = {
	template: template(),
	data: function () {

		const ukbb = new Ukbb();

		return {
			play: ukbb.play,
			back: ukbb.back,
			forward: ukbb.forward
		}
	},
	compiled: function () {
		console.log(this)
	},
	mounted: function () {

		//console.log(this.$el)
	}
};


//export const UkbbComponent = Vue.component('ukbb-component',componentData);
export default componentData;
