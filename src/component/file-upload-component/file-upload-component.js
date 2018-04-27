import Vue from 'vue';
import template from './file-upload-component.pug';
import {socket} from "../../service/socket";

import './file-upload-component.styl';
import {urlCron} from  '../../config/congig-url'
import {bg} from '../../directive/directive-random-background';

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
			urls,
			selectedFileName: 'Выбрать файл',
			onSendText: 'Отправить',
			selectedFile: null
		};
	},
	methods: {
		click: function (com) {
			bg.src = com.src;
		},
		onSelectFile: function (e) {
            e.preventDefault();
            this.$refs['file-select'].click()
        },
        onSend: function (e){
            e.preventDefault();
            this.selectedFileName = '...загрузка...'
            const formData = new FormData();
            formData.append('afile', this.selectedFile, localStorage.hash );
            const file = formData.getAll('afile')[0]
            let i = 10, k = 0

			const timer = setInterval(()=>{
				//i+=(10 - i/10);
                i+=((5 - i/20));
				this.load = i;
			},200)

            socket.$get('file',({file: file}))
                .catch(err => {
                    console.log(err)
					alert('Ошибка загрузки')
                    this.load = 100
					clearInterval(timer)
                    setTimeout(()=>{
                        this.load = 0
                    },200)
                    return null
                })
                .then(res=>{
                    if(res){
                        console.log(res)
                        const nFile = parseInt(res.data)-1;
                        console.log(nFile)
                        this.urls[nFile].src = this.urls[nFile].src.replace(/\?d.+$/, `?d=${new Date().toISOString()}`)
					}
                    this.selectedFileName = 'Выбрать файл'
                    this.load = 100;
                    clearInterval(timer)
					setTimeout(()=>{
                        this.load = 0
					},200)
                })

		}
	},
	mounted: function () {
		this.$refs['file-select'].addEventListener('change',  (e) =>{
			const fileName =  this.$refs['file-select'].files[0].name
            if(!fileName.match(/(\.jpg)|(\.JPG)$/)){
                alert('Разрешен только jpg')
				return
            }
            this.selectedFile = this.$refs['file-select'].files[0]
			this.selectedFileName = this.selectedFile.name
        })

		function isNumber (o) {
			return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
		}


	}
});
