"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamB = exports.streamA = void 0;
/*declare const process: any;
process.env.TZ = 'UTC';*/
const http = require("http");
const fs = require("fs");
const dateFormat = require("dateformat");
const path = require("path");
const https = require("https");
const console_key_1 = require("./utils/console-key");
const patternDate = '(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})';
const rootDir = console_key_1.getConsoleKey('rootdir');
const irDir = path.resolve(__dirname, rootDir || './dist', 'img', 'ir');
const viDir = path.resolve(__dirname, rootDir || './dist', 'img', 'vi');
// 0 * * * * sh /home/max/www/borispol-radar2/server/cron.sh
class FileSystem {
    constructor() {
        this.fs = fs;
    }
    unlink(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err)
                    return reject(err);
                resolve(filePath);
            });
        });
    }
}
const fileSystem = new FileSystem();
function ensureExists(path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = parseInt("0777", 8);
    }
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code == 'EEXIST')
                cb(null); // ignore the error if the folder already exists
            else
                cb(err); // something else went wrong
        }
        else
            cb(null); // successfully created folder
    });
}
const creteDir = (path) => {
    return new Promise((res, rej) => {
        ensureExists(path, parseInt("0777", 8), (err) => {
            if (err)
                return rej(err);
            res(path);
        });
    });
};
const writeFile = (url, fileName) => {
    return new Promise((res, rej) => {
        fs.exists(fileName, (bool) => {
            if (!bool) {
                const file = fs.createWriteStream(fileName);
                let client;
                if (url.match(/^https/)) {
                    client = https;
                }
                else {
                    client = http;
                }
                client.get(url, function (response) {
                    console.log(response.statusCode);
                    if (response.statusCode === 200) {
                        response.pipe(file);
                        file.on('close', function () {
                            res(fileName); // close() is async, call cb after close completes.
                        })
                            .on('error', (err) => {
                            rej(err);
                        });
                    }
                    else {
                        rej(`Error status code -> ${response.statusCode}`);
                    }
                })
                    .on('error', (err) => {
                    console.error('Error -> ', err);
                    rej(err);
                });
            }
            else {
                rej('File exist');
            }
        });
    });
};
const buildImage = ({ srcDir, networkUrl }) => {
    const viDir = srcDir;
    return creteDir(viDir)
        .then(viDir => {
        const d = new Date();
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
        return path.resolve(viDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'));
    })
        .then(fileName => {
        return writeFile(networkUrl, fileName);
        // return writeFile("https://en.sat24.com/image?type=visual&region=eu", fileName)
    })
        .then((fileName) => {
        console.log(`Success ${fileName}`);
        return fileName;
    })
        .catch(err => {
        console.log(err);
        return Promise.reject(err);
    })
        .then(() => {
        return new Promise((resolve) => {
            const filesForDel = [];
            fs.readdir(viDir, (err, files) => {
                files.forEach((file) => {
                    const matches = file.match(new RegExp(patternDate)).slice(1).map(Number);
                    if (matches[1])
                        matches[1]--;
                    const d = new Date(matches[0], matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]).getTime();
                    if ((new Date().getTime() - d) > 24 * 3600 * 1000) {
                        filesForDel.push(file);
                    }
                    resolve(filesForDel);
                });
            });
        });
    })
        .then((filesForDel) => {
        console.log('filesForDel ->', filesForDel);
        return Promise.all(filesForDel.map((file) => {
            return fileSystem.unlink(path.resolve(viDir, file));
        }));
    })
        .catch(err => {
        console.error(err);
        return Promise.reject(err);
    });
};
const streamA = () => {
    buildImage({
        srcDir: irDir,
        networkUrl: 'http://www.sat24.com/image2.ashx?region=eu&ir=true'
    });
};
exports.streamA = streamA;
const streamB = () => {
    buildImage({
        srcDir: viDir,
        networkUrl: 'https://en.sat24.com/image?type=visual&region=eu'
    });
};
exports.streamB = streamB;
//# sourceMappingURL=save-image.cron.js.map