
let url = {
	dev: {
		//ir:'http://localhost/all/borispol.radar/img/sat/',
		ir:'http://borispol.hol.es/img/sat/',
		vi:'http://borispol.hol.es/img/vis/',
		ukbb: '/ppp/ukbb-latest.php'
	},
	prod: {
		ir:'http://borispol.hol.es/img/sat/',
		vi:'http://borispol.hol.es/img/vis/',
        ukbb: 'php/ukbb-latest.php'
	}
};

export const	urlCron = url[NODE_ENV]
