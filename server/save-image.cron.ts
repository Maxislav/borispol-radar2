/*declare const process: any;
process.env.TZ = 'UTC';*/

import  http from 'http';
import  fs from 'fs';
import  dateFormat from 'dateformat';
import  path from 'path';
import  https from 'https'
import ErrnoException = NodeJS.ErrnoException;
import {Stats} from 'fs';
import {deepCopy} from './utils/deep-copy';

const patternDate = '(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})';

const configFile = (process.env.NODE_ENV || 'prod').trim() == 'dev' ? 'server.config.dev.json' : 'server.config.prod.json';
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, configFile), 'utf8').toString());
const rootDir = config.saveImgDir;

const irDir = path.resolve(__dirname, rootDir , './dist', 'img', 'ir');
const viDir = path.resolve(__dirname, rootDir , './dist', 'img', 'vi');

// 0 * * * * sh /home/max/www/borispol-radar2/server/cron.sh


class FileSystem {
    fs: any;

    constructor() {
        this.fs = fs;
    }

    unlink(filePath: string) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) return reject(err);
                resolve(filePath)
            })
        })

    }
}

const fileSystem = new FileSystem();

function ensureExists(path, mask: any, cb): void {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = parseInt("0777", 8);
    }
    fs.mkdir(path, mask, function (err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}

const creteDir = (path: string): Promise<string> => {
    return new Promise<string>((res, rej) => {
        ensureExists(path, parseInt('0777', 8), (err) => {
            if (err) return rej(err);
            res(path)
        })
    })
};

const writeFile = (url: string, fileName: string): Promise<any> => {
    return new Promise((res, rej) => {
        fs.stat(fileName, (err: ErrnoException, stat: Stats) => {
            if (err == null) { // file exist
                return rej('File exist')
            } else if (err.code == 'ENOENT') {
                // file does not exist
                const file = fs.createWriteStream(fileName);
                let client;
                if (url.match(/^https/)) {
                    client = https
                } else {
                    client = http
                }
                try {
                    client.get(url, function (response) {
                        console.log(response.statusCode)
                        if (response.statusCode === 200) {
                            response.pipe(file);
                            file.on('close', function () {
                                res(fileName)  // close() is async, call cb after close completes.
                            })
                                .on('error', (err: Error) => {
                                    rej(err)
                                })
                        } else {

                            rej(`Error status code -> ${response.statusCode}`)
                        }
                    })
                        .on('error', (err: Error) => {
                            console.error('Error -> ', err);
                            rej(err)
                        });
                } catch (e) {
                    console.error('try catch we ->', e);
                    rej(e)
                }

            } else {
                console.error(` ${JSON.stringify(err, null, 4)}`);
                rej(`some error -> ${JSON.stringify(err, null, 4)}`)
            }
        })
    })
};
const buildImage = ({
                        srcDir,
                        networkUrl
                    }) => {

    const viDir = srcDir;
    return creteDir(viDir)
        .then(viDir => {
            const d = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000);
            const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
            return path.resolve(viDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
        })
        .then(fileName => {
            return writeFile(networkUrl, fileName)
                .catch(e => {
                    console.error(`Error write file -> ${fileName}`, e);
                    return Promise.reject(e);
                })
            // return writeFile("https://en.sat24.com/image?type=visual&region=eu", fileName)
        })
        .then((fileName) => {
            console.log(`Success ${fileName}`);
            return fileName
        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err);
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                const filesForDel: string[] = [];
                fs.readdir(viDir, (err, files) => {
                    if (err) {
                        console.error('Error read dir->', err);
                        return reject(err)
                    }
                    files.forEach((file: string) => {
                        const matches: number[] = file.match(new RegExp(patternDate)).slice(1).map(Number);
                        if (matches[1]) matches[1]--;
                        const d: number = new Date(matches[0], matches[1], matches[2], matches[3], matches[4], matches[5], matches[6]).getTime();
                        if ((new Date().getTime() - d) > 24 * 3600 * 1000) {
                            filesForDel.push(file)
                        }
                        resolve(filesForDel)
                    });
                })
            })

        })
        .then((filesForDel: string[]) => {
            console.log('filesForDel ->', filesForDel)
            return Promise.all(filesForDel.map((file: string) => {
                return fileSystem.unlink(path.resolve(viDir, file))
            }))
        })
        .catch(err => {
            console.error(err);
            return Promise.reject(err)
        });
}

export const streamA = () => {
    buildImage({
        srcDir: irDir,
        networkUrl: 'http://www.sat24.com/image2.ashx?region=eu&ir=true'
    })
        .catch(e => {
            console.error('Error save A -> ', e)
        })
};

export const streamB = () => {
    buildImage({
        srcDir: viDir,
        networkUrl: 'https://en.sat24.com/image?type=visual&region=eu'
    })
        .catch(e => {
            console.error('Error save B -> ', e)
        })
};


