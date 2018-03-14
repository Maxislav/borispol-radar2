process.env.TZ = 'UTC';
import * as http from 'http';
import * as fs from 'fs';
import * as dateFormat from 'dateformat';
import * as path from 'path';
//import * as request from 'request';
import * as  https from 'https'

const irDir = path.resolve(__dirname, '../src', 'img', 'ir')
const viDir = path.resolve(__dirname, '../src', 'img', 'vi')

function ensureExists(path, mask: any, cb): void {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = parseInt('0777', 8);
        ;
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
}

const writeFile = (url: string, fileName: string): Promise<any> => {
    return new Promise((res, rej) => {
        fs.exists(fileName, (bool: boolean) => {
            if (!bool) {
                const file = fs.createWriteStream(fileName);
                let client;
                if (url.match(/^https/)) {
                    client = https
                } else {
                    client = http
                }
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
                        console.error('Error -> ', err)
                        rej(err)
                    });
            } else {
                rej('File exist')
            }
        })
    })
}


creteDir(irDir)
    .then(irDir => {
        const d = new Date();
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
        return path.resolve(irDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
    })
    .then(fileName => {
        return writeFile('http://www.sat24.com/image2.ashx?region=eu&ir=true', fileName)
        //return writeFile("https://en.sat24.com/image?type=visual&region=eu", fileName)
    })
    .then((fileName) => {
        console.log(`Success ${fileName}`)
        return fileName
    })
    .catch(err => {
        console.log(err)
    })

creteDir(viDir)
    .then(viDir => {
        const d = new Date();
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
        return path.resolve(viDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
    })
    .then(fileName => {
        return writeFile('https://en.sat24.com/image?type=visual&region=eu', fileName)
        //return writeFile("http://www.sat24.com/image2.ashx?region=eu&ir=true", fileName)
    })
    .then((fileName) => {
        console.log(`Success ${fileName}`)
        return fileName
    })
    .catch(err => {
        console.log(err)
    })





