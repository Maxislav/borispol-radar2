


export default {
	install :function(Vue, options){
	let prefix = 'radar';

	if(options && options.prefix){
		prefix = options.prefix
	}

	const localStorage = window.localStorage;

	localStorage.getItem(prefix);
	let obj = JSON.parse(localStorage.getItem(prefix)) || {}


	const storage = {};
	Object.defineProperties(storage, {
		setItem: {
			get: ()=>{
				return function (key, value) {
					//console.log(key, value)
					obj[key] = value;
					localStorage.setItem(prefix, JSON.stringify(obj))
				}
			}
		},
		getItem: {
			get:()=>{
				return function (key) {
					obj = JSON.parse(localStorage.getItem(prefix)) || {};
					return obj[key]
				}
			}
		}
	});



	Object.defineProperties(Vue.prototype, {
		$storage: {
			get: ()=>{
				return storage
			}
		}
	})
}
}