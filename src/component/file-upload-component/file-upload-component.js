import Vue from 'vue';
import template from './file-upload-component.pug';
import {socket} from "../../service/socket";

import './file-upload-component.styl';
import {urlCron} from  '../../config/congig-url'
import {bg} from '../../directive/directive-random-background';

let socketHash = 0;
export const FileUploadComponent = Vue.component('file-upload-component', {
	template: template({action: urlCron.upload}),

	data: function () {
		const urls = [];
		let i = 8;
		do{
			urls.unshift(
				new Vue({
					data: {
						src: './img/bg/' + i + '.jpg?d='+Date.now()
					}
				})
			);
			i--;
		}while (1<=i);
		return {
			load: 0,
			urls
		};
	},
	methods: {
		click: function (com) {

			bg.src = com.src;
		}
	},
	mounted: function () {

		var $this = this;
		var form = document.getElementById('file-form');

		var elSelectFile = form.getElementsByTagName('button')[0];

		var fileSelect = document.getElementById('file-select');
		var uploadButton = document.getElementById('upload-button');
		var files = null;
		var formData;
		var fileName = null;


		fileSelect.addEventListener('change', function (e) {
			if(!this.files.length) return;
			console.log(this.files[0].name);
			elSelectFile.innerHTML = this.files[0].name;
			fileName = this.files[0].name;
			if(!fileName.match(/(\.jpg)|(\.JPG)$/)){
				alert('Разрешен только jpg')
			}
		});
		elSelectFile.addEventListener('click', selectFile);
		function selectFile(e) {
			e.preventDefault();
			this.parentElement.getElementsByTagName('input')[1].click()
		}

		form.onsubmit = function(event) {
			event.preventDefault();
			if(!fileName.match(/(\.jpg)|(\.JPG)$/)){
				alert('Разрешен только jpg')
				return;
			}
			console.log('send');
			files = fileSelect.files;
			formData = new FormData();
			formData.append('afile', files[0], localStorage.hash );
            const f = formData.getAll('afile')[0]
            uploadButton.innerHTML = 'Загрузка...';
            socket.$get('file',({file: f}))
				.catch(err => {
					console.log(err)
					return null
				})
				.then(res=>{
					if(res)
                    console.log(res)
                    fileSelect.value = '';
                    uploadButton.innerHTML = 'Отправить';
                    const nFile = parseInt(res.data);
                    console.log(nFile)
                    $this.urls[parseInt(res.data)].src = $this.urls[parseInt(res.data)].src + '?d='+new Date();
                    elSelectFile.innerHTML = 'Выбрать файл';
				})

		};


		function isNumber (o) {
			return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
		}


	}
});
