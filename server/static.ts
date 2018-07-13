import './constant/console-color'
import { getConsoleKey } from './utils/console-key';
import * as fs from 'fs';
import * as path from 'path'
import { defaultSetting } from './phplike/settingborispolradar';

declare global {
    interface String {
        green(length : number) : string;
        yellow(length : number) : string;
        red(length : number) : string;
        blue(length : number) : string;
    }
}


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
let express = require('express'),
    http = require('http'),
    url = require('url'),
    https = require('https'),
    mime = require('mime'),
    compression = require('compression')
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'server.config.json'), 'utf8').toString());
const port = getConsoleKey('port') || config.port;
const rootDir = getConsoleKey('rootdir') ?  [getConsoleKey('rootdir')] :  deepCopy(config.rootPath);
const app = express();
app.set('port', port);
app.use(compression({filter: ()=>{
        return true
    }}))


http.createServer(app).listen(app.get('port'), () => {
    console.log((`Server start on port: ${port}`).green);
});


app
    .get('*/php/settingborispolradar.php', defaultSetting)
    .use((req, res, next) => {
    const uri = url.parse(req.url).pathname;
    for (let i = 0; i < config.proxies.length; i++) {
        const proxiRegex = new RegExp(config.proxies[i].source);
        if (proxiRegex.test(uri)) {
            console.log(uri);
            proxiServ(req, res, config.proxies[i], new Date().getTime());
            return;
        }
    }
    next();
})
   .use(main);
///var/www/borispol-radar/dist/php/settingborispolradar.php:



let timer = timerFoo();
function timerFoo() {
    return setTimeout(() => {
        console.log('=======================+++++++++++++++++++++=========================='.green)
    }, 1000);
}

function main(request, response) {
    clearTimeout(timer);
    timer = timerFoo();

    //console.log('oloevera')

    const uri = url.parse(request.url).pathname;
    if (!checkAccess(request)) {
        response.statusCode = 403;
        response.end('Error access');
        console.log('Error access'.red);
        return;
    }
    const t0 = new Date().getTime();
    sendFileSave(url.parse(request.url).pathname, response, t0);
}


// server.on( 'request',  );

function checkAccess(req) {
    return url.parse(req.url, true).query.secret != 'o_O';
}

function sendFileSave(filePath, res, timeLong) {
    if (/\/$/.test(filePath)) {
        filePath += 'index.html';
    }

    try {
        filePath = decodeURIComponent(filePath);
    } catch (err) {
        res.status = 400;
        res.end('Bad request');
        return;
    }

    if (~filePath.indexOf('\0')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
    }

    const errList = []
    if (filePath.match(/^\/?(node_modules|bower_components|libs)/)) {
        res.set({
            'Cache-control': 'public, max-age=2629000;',
        });
    }
    (function zz(_rootDir) {
        return new Promise((resolve, reject) => {
            const _path = path.join(__dirname, _rootDir.shift(), filePath);
            isStat(_path)
                .then((filePath) => {
                    const file = new fs.ReadStream(filePath);
                    return sendFile(file, filePath, res, timeLong);
                })
                .catch((obj) => {
                    errList.push(obj)
                    if (_rootDir.length) {
                        return zz(_rootDir)
                    } else {
                        const errMess = errList.map(it => it.message.concat(' -> ', it.filePath)).join(',').trim()
                        console.log(errMess.red);
                        res.statusCode = 404;
                        res.end(obj.message)
                    }
                });
        })
            .catch(err=>{
                console.log('Error 1326 - >' , err)
            })
    })(deepCopy(rootDir))
}


function isStat(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, status) => {
            if (err) {
                reject({
                    error: err,
                    statusCode: 404,
                    filePath,
                    message: 'File not found1',
                });
            } else if (status.isDirectory()) {
                filePath += '/index.html';
                return isStat(filePath);
            } else if (!status.isFile()) {
                reject({
                    error: err,
                    statusCode: 404,
                    message: 'File not found2',
                });
            }
            resolve(filePath);
        });
    })
}


function sendFile(file, filePath, res, timeLong) {
    const headers = {};


    let contentType = mime.lookup(filePath);
    if (contentType == 'text/html') {
        contentType += '; charset=UTF-8';
    }
    if (contentType) {
        headers['Content-Type'] = contentType;
        if (contentType.match(/^video|^audio/)) {
            return videoSend(...arguments)
        }
        //	console.log('Content-Type ->', contentType)
    }
    res.writeHead(200, headers);


    file.pipe(res);
    file.on('error', (err) => {
        res.statuscode = 500;
        res.end('Server error');
        console.error(err);
    });

    file.on('end', () => {
        const resTime = `${new Date().getTime() - timeLong}ms`;
        const fileName = filePath.match(/[^\/]+\..{1,}$/) ? filePath.match(/[^\/]+\..{1,}$/)[0] : 'unknown';
        console.log('path -> '.yellow + filePath + ': name ->' + fileName + ' : ' + resTime.blue);
    });

    res.on('close', () => {
        file.destroy();
    });
}

function videoSend(...args) {
    const [file, filename, res, timeLong] = args
    res.sendFile(filename);
    const resTime = `${new Date().getTime() - timeLong}ms`;
    console.log(`${filename} : ${resTime}`);
    return null;
}


function proxiServ(request, response, _options, timeLong) {
    const ph = url.parse(request.url);
    const options = {
        port: _options.data.port,
        hostname: _options.data.hostname,
        method: request.method,
        path: ph.path,
        headers: request.headers,
    };

    const proxyRequest = https.request(options);


    proxyRequest.on('response', (proxyResponse) => {
        proxyResponse.on('data', (chunk) => {
            options;
            const respStr = new Buffer(chunk.toString(), 'binary').toString();
            proxyResponse;
            response.write(chunk, 'binary');
        });
        proxyResponse.on('end', () => {
            response.end();
            const resTime = `${new Date().getTime() - timeLong}`;
            console.log((`${url.parse(request.url).pathname} : ${resTime}ms`));
        });
        response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
    });
    proxyRequest.on('error', (err) => {
        console.error(err);
        // proxyRequest.end();
        response.statusCode = 204;
        response.end('No connect');
    });
    request.on('data', (chunk) => {
        proxyRequest.write(chunk, 'binary');
    });
    request.on('end', () => {
        proxyRequest.end();
    });
}


// использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function deepCopy(oldObj) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
        newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
        for (const i in oldObj) {
            newObj[i] = deepCopy(oldObj[i]);
        }
    }
    return newObj;
}

export { app as appStatic }