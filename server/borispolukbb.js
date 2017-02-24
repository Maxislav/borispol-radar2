
const http = require( "http" );
module.exports = function (req, res, next) {
	//http://meteoinfo.by/radar/UKBB/UKBB_latest.png?v=288
	let opt = {
		port: 80,
		hostname: 'meteoinfo.by',
		method: req.method,
		path: '/radar/UKBB/UKBB_latest.png?'+new Date().toISOString(),
		headers: req.headers
	};
	res.header("Access-Control-Allow-Origin", "http://localhost*");
	const proxyRequest = http.request( opt );
	proxyRequest.on( 'response', function ( proxyResponse ) {
		proxyResponse.on( 'data', function ( chunk ) {
			res.write( chunk, 'binary' );
		} );
		proxyResponse.on( 'end', function () {
			res.end();
		} );
		//proxyResponse.writeHead("Access-Control-Allow-Origin", "http://178.62.44.54");
		res.writeHead( proxyResponse.statusCode, proxyResponse.headers );
		// res.writeHead("Access-Control-Allow-Origin: http://178.62.44.54");
		// res.header("Access-Control-Allow-Origin", "http://178.62.44.54");
	} );
	proxyRequest.on('error', function(err){
		res.statusCode = 204;
		res.end( 'No connect' );
	});
	req.on( 'data', function ( chunk ) {
		proxyRequest.write( chunk, 'binary' );
	} );
	req.on( 'end', function () {
		proxyRequest.end();
	} );
};

