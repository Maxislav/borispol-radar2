
let url = {
	dev: {
		//ir:'http://localhost/all/borispol.radar/img/sat/',
		ir:'http://borispol.hol.es/img/sat/',
		vi:'http://borispol.hol.es/img/vis/',
	},
	prod: {
		ir:'http://borispol.hol.es/img/sat/',
		vi:'http://borispol.hol.es/img/vis/',
	}
};

export const	urlCron = url[NODE_ENV]
