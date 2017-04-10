let url = {
	dev: {
		//ir:'http://localhost/all/borispol.radar/img/sat/',
		ir: 'img/ir/',
		vi: 'img/vi/',
		ukbb: '/ppp/UKBB_latest.png',
		//ukbb: 'img/meteoradar_borispol.png',
		"ukbb-history": "/proxy-history/loadUkbbHistory.php",
		"upload": '/upload.php'
	},
	production: {
		ir: 'img/ir/',
		vi: 'img/vi/',
		ukbb: 'php/ukbb-latest.php',
		"ukbb-history": "php/loadUkbbHistory.php",
		"upload": 'php/upload.php'
	}
};

export const urlCron = url[NODE_ENV || 'production'];
