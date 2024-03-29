"use strict";
/*declare const process: any;
process.env.TZ = 'UTC';*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamB = exports.streamA = void 0;
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const dateformat_1 = __importDefault(require("dateformat"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const patternDate = '(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})';
const configFile = (process.env.NODE_ENV || 'prod').trim() == 'dev' ? 'server.config.dev.json' : 'server.config.prod.json';
const config = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(__dirname, configFile), 'utf8').toString());
const rootDir = config.saveImgDir;
const irDir = path_1.default.resolve(__dirname, rootDir, './dist', 'img', 'ir');
const viDir = path_1.default.resolve(__dirname, rootDir, './dist', 'img', 'vi');
// 0 * * * * sh /home/max/www/borispol-radar2/server/cron.sh
class FileSystem {
    constructor() {
        this.fs = fs_1.default;
    }
    unlink(filePath) {
        return new Promise((resolve, reject) => {
            fs_1.default.unlink(filePath, (err) => {
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
    fs_1.default.mkdir(path, mask, function (err) {
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
        ensureExists(path, parseInt('0777', 8), (err) => {
            if (err)
                return rej(err);
            res(path);
        });
    });
};
const writeFile = (url, fileName) => {
    return new Promise((res, rej) => {
        fs_1.default.stat(fileName, (err, stat) => {
            if (err == null) { // file exist
                return rej('File exist');
            }
            else if (err.code == 'ENOENT') {
                // file does not exist
                const file = fs_1.default.createWriteStream(fileName);
                let client;
                if (url.match(/^https/)) {
                    client = https_1.default;
                }
                else {
                    client = http_1.default;
                }
                try {
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
                catch (e) {
                    console.error('try catch we ->', e);
                    rej(e);
                }
            }
            else {
                console.error(` ${JSON.stringify(err, null, 4)}`);
                rej(`some error -> ${JSON.stringify(err, null, 4)}`);
            }
        });
    });
};
const buildImage = ({ srcDir, networkUrl }) => {
    const viDir = srcDir;
    return creteDir(viDir)
        .then(viDir => {
        const d = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000);
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours());
        return path_1.default.resolve(viDir, dateformat_1.default(dd, 'yyyymmddHH').concat('00.gif'));
    })
        .then(fileName => {
        return writeFile(networkUrl, fileName)
            .catch(e => {
            console.error(`Error write file -> ${fileName}`, e);
            return Promise.reject(e);
        });
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
        return new Promise((resolve, reject) => {
            const filesForDel = [];
            fs_1.default.readdir(viDir, (err, files) => {
                if (err) {
                    console.error('Error read dir->', err);
                    return reject(err);
                }
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
            return fileSystem.unlink(path_1.default.resolve(viDir, file));
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
    })
        .catch(e => {
        console.error('Error save A -> ', e);
    });
};
exports.streamA = streamA;
const streamB = () => {
    buildImage({
        srcDir: viDir,
        networkUrl: 'https://en.sat24.com/image?type=visual&region=eu'
    })
        .catch(e => {
        console.error('Error save B -> ', e);
    });
};
exports.streamB = streamB;
//# sourceMappingURL=save-image.cron.js.map