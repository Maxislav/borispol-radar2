
let url = {
	dev: {
		ir:'http://localhost/allborispol.radar/img/sat/',
		vi:'http://localhost/allborispol.radar/img/vis/',
	},
	prod: {
		ir:'http://borispol.hol.es/img/sat/',
		vi:'http://borispol.hol.es/img/vis/',
	}
};

export const	urlCron = url[NODE_ENV]
