const fs = require('fs');
const dateFormat = require('dateformat');

class Version {
	constructor() {

	}
	apply(compiler) {
		// Specify the event hook to attach to
		compiler.hooks.compilation.tap(
			'Version',
			(compilation) => {

				const data = fs.readFileSync('src/index.html',  'utf8');
				const repl = data.replace(/Release\sdate:[^<]+/,'Release date: '  + dateFormat(new Date(), 'yyyy.mm.dd HH:MM:ss' ));

				fs.writeFileSync('src/index.html', repl);
				/*fs.readFile('index.pug', 'utf8', function(err, data) {
					if (err) throw err;

					const repl = data.replace(/(Release\sdate:.+\d)/,'Release date: '  + dateFormat(new Date(), 'yyyy.mm.dd HH:MM:ss' ));

					fs.writeFile('index.pug', repl, function (err) {
						if (err) return console.log(err);

						setTimeout(()=>{
							callback()
						}, 2000)
					});


				});
*/
				console.log('This is an example plugin!');
				// console.log('Here’s the `compilation` object which represents a single build of assets:', compilation);

				// Manipulate the build using the plugin API provided by webpack
				//compilation.addModule(VersionPlugin);

				//callback();
			}
		);
	}
}
module.exports = Version;


