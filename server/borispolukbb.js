
const http = require( "http" );




function httpGet(url){
    return new Promise((res, rej)=> {
        http.get(url, (resp) => {
            let data = '';
            let dataJson = {};

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {

                try {
                    dataJson = JSON.parse(data)
                } catch (e) {
                    console.error(e);
                    rej(e)
                }

                res(dataJson)

                // const {times} = dataJson;
            });
        })
    })
}





module.exports = function (req, res, next) {


    httpGet('http://veg.by/meteoradar/kiev/update.json?readonly=1')
		.then(data => {
			const {times} = data;
            let opt = {
                port: 80,
                hostname: 'veg.by',
                method: 'GET',
                path: `/meteoradar/data/ukbb/images/${times[times.length - 1]}.png`,
               // headers: req.headers
            };
            res.header("Access-Control-Allow-Origin", "*");
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
		})



	//http://meteoinfo.by/radar/UKBB/UKBB_latest.png?v=288

};

