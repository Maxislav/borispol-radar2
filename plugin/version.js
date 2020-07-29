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

				const data = fs.readFileSync('index.pug',  'utf8');
				const repl = data.replace(/(Release\sdate:.+\d)/,'Release date: '  + dateFormat(new Date(), 'yyyy.mm.dd HH:MM:ss' ));

				fs.writeFileSync('index.pug', repl);
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

	_apply(compiler) {

		compiler.plugin('startup', function (source, module, hash) {

			return source;
		})
		compiler.plugin('emit', function (compilation, callback) {
			console.log('EMIT Version!');


			setTimeout(()=>{
				callback()
			}, 2000)


		});

		compiler.plugin('make', function (compilation, callback) {

				fs.readFile('index.pug', 'utf8', function(err, data) {
					if (err) throw err;

					const repl = data.replace(/(Release\sdate:.+\d)/,'Release date: '  + dateFormat(new Date(), 'yyyy.mm.dd HH:MM:ss' ));

					fs.writeFile('index.pug', repl, function (err) {
						if (err) return console.log(err);

						setTimeout(()=>{
							callback()
						}, 2000)
					});


				});



			// Compile the template (queued)
			/*compilationPromise = childCompiler.compileTemplate(self.options.template, compiler.context, self.options.filename, compilation)
				.catch(function (err) {
					compilation.errors.push(prettyError(err, compiler.context).toString());
					return {
						content: self.options.showErrors ? prettyError(err, compiler.context).toJsonHtml() : 'ERROR',
						outputName: self.options.filename
					};
				})
				.then(function (compilationResult) {
					// If the compilation change didnt change the cache is valid
					isCompilationCached = compilationResult.hash && self.childCompilerHash === compilationResult.hash;
					self.childCompilerHash = compilationResult.hash;
					self.childCompilationOutputName = compilationResult.outputName;
					callback();
					return compilationResult.content;
				});*/
		});


		compiler.plugin('done', function () {
			console.log('done Version!');
		});
	}
}
module.exports = Version;


