let url = {
	dev: {
		//ir:'http://localhost/all/borispol.radar/img/sat/',
		ir: 'img/ir/',
		vi: 'img/vi/',
		ukbb: '/ppp/borisbolukbb',
		//ukbb: 'img/meteoradar_borispol.png',
		//"ukbb-history": "/proxy-history/loadUkbbHistory.php",
		//"ukbb-history": "http://localhost:8085/loadUkbbHistory",
		"ukbb-history": "http://178.62.44.54:8085/loadUkbbHistory",
		"upload": '/upload.php'
	},
	production: {
		ir: 'img/ir/',
		vi: 'img/vi/',
		ukbb: 'php/ukbb-latest.php',
		//"ukbb-history": "php/loadUkbbHistory.php",
    "ukbb-history": "http://178.62.44.54:8085/loadUkbbHistory",
		"upload": 'php/upload.php'
	}
};

export const urlCron = url[NODE_ENV || 'production'];
