const http = require('http');

const getBodyStr = (req, t) => {

    const options = {
        host: 'meteoinfo.by',
        path: `/radar/?q=UKBB&t=${t}0`
    };

    return new Promise((resolve, reject) => {
        const proxyRequest = http.request(options);

        const chunks = []

        proxyRequest.on('response', function (proxyResponse) {
            proxyResponse.on('data', function (chunk) {
                chunks.push(chunk)
            });
            proxyResponse.on('end', function () {

                var body = Buffer.concat(chunks)

                resolve({
                    err: null,
                    data: body.toString(),
                    t
                })
            });
        });
        proxyRequest.on('error', function (err) {
            reject(err)


        });
        req.on('data', function (chunk) {
            proxyRequest.write(chunk, 'binary');
        });
        req.on('end', function () {
            proxyRequest.end();
        });
    })
}

const getImgUrl = (bodyStr, t) => {
    return new Promise((resolve, reject) => {
        const match1 = bodyStr.match(/id=\"rdr\"[\s\S]*<\/table>/)[0]
        const match2 = match1.match(/UKBB_(.+)\.png/)[0]
        resolve({data: match2, t})
    })
}


module.exports = function (req, res) {

    console.log('load history')
    const imgList = ((i) => {
        const a = [];
        while (i) {
            i -= 1
            a.push(null)
        }
        return a
    })(10);
    res.header("Access-Control-Allow-Origin", "*");




    Promise.all(imgList.map((it, i) => {
        return getBodyStr(req, i)
            .then(({data, t}) => {
                return getImgUrl(data, t)
            })
            .then(({data, t}) => {
                imgList[t] = data
                return data
            })
            .catch(err => {
                return Promise.reject(err)
            })
    }))
        .then((list) => {
            res.setHeader('Content-Type', 'application/json');
            console.log('res ->', list)
            res.send(JSON.stringify(list, null, 3));
        })
        .catch(err => {
            res.statusCode = 204;
            res.end(err.toString());
        });
};