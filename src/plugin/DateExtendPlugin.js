function ExtendDate(options) {
	
}
ExtendDate.prototype.apply = function (compiler) {
	compiler.plugin('done', function() {
		console.log('Hello World!');
	});
};
module.exports = ExtendDate;