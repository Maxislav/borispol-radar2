let url = {
	dev: {
		//ir:'http://localhost/all/borispol.radar/img/sat/',
		ir: 'http://borispol.hol.es/img/sat/',
		vi: 'http://borispol.hol.es/img/vis/',
		//ukbb: '/ppp/UKBB_latest.png',
		ukbb: 'img/meteoradar_borispol.png',
		"ukbb-history": "/proxy-history/loadUkbbHistory.php"
	},
	production: {
		ir: 'http://borispol.hol.es/img/sat/',
		vi: 'http://borispol.hol.es/img/vis/',
		ukbb: 'php/ukbb-latest.php',
		"ukbb-history": "php/loadUkbbHistory.php"
	}
};

export const urlCron = url[NODE_ENV || 'production'];
