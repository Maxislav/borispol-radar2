import Vue from 'vue';
import template from './file-upload-component.pug';
//import
import './file-upload-component.styl';
import {urlCron} from  '../../config/congig-url'
import {bg} from '../../directive/directive-random-background';

export const FileUploadComponent = Vue.component('file-upload-component', {
	template: template({action: urlCron.upload}),

	data: function () {
		const urls = [];

		let i = 8;


		/*setTimeout(()=>{
			urls[0].src = './img/bg/'+7+'.jpg'
		},1000)*/

		do{
			urls.unshift(
				new Vue({
					data: {
						src: './img/bg/' + i + '.jpg'
					}
				})
			);
			i--;
		}while (1<=i);


		console.log(urls );


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
		//	s.progressLoader.fadeTo(222, 1)

			files = fileSelect.files;
			formData = new FormData();
			formData.append('afile', files[0], localStorage.hash );
			//formData.append('hash', localStorage.hash);
			post();
			uploadButton.innerHTML = 'Загрузка...';

		};

		function post() {
			var xhr = new XMLHttpRequest();
			xhr.open('POST', form.action, true);
			xhr.upload.onprogress = function (event) {
				$this.load = (100*event.loaded / event.total);
				/*s.progressBar.css({
					width: (100*event.loaded / event.total) + '%'
				});*/
			};
			xhr.onload = function () {
				if (xhr.status === 200) {
					try {
						var res = JSON.parse(xhr.response);
						if(isNumber(res)){


							//replaceImg(parseInt(res.n));
							fileSelect.value = '';
							uploadButton.innerHTML = 'Отправить';
							$this.urls[res].src = $this.urls[res].src + '?d='+new Date();

							/*s.progressLoader.fadeTo(222, 0, function () {
								s.progressBar.css({
									width: '0'
								});
							});*/
							elSelectFile.innerHTML = 'Выбрать файл';

						}else{
							console.warn(xhr)
						}
					}catch (e){
						console.error(e)
					}
					$this.load = 0;
				} else {
					console.warn(xhr)
				}
			};
			xhr.send(formData);
		}

		function isNumber (o) {
			return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
		}


	}
});
