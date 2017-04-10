var fs = require('fs');
const dateFormat = require('dateformat');

class Version {
	constructor() {

	}

	apply(compiler) {

		compiler.plugin('emit', function (compilation, callback) {
			console.log('EMIT Version!');


			fs.readFile('index.pug', 'utf8', function(err, data) {
				if (err) throw err;
				console.log(data);

				const repl = data.replace(/(Release\sdate:.+\d)/,'Release date: '  + dateFormat(new Date(), 'yyyy.mm.dd HH:MM:ss' ));

				console.log(repl);
				fs.writeFile('index.pug', repl, function (err) {
					if (err) return console.log(err);

					setTimeout(()=>{
						callback()
					}, 2000)
				});


			});


		})

		compiler.plugin('done', function () {
			console.log('Hello Version!');
		});
	}
}
module.exports = Version


