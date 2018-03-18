declare const process: any;
process.env.TZ = 'UTC';
import * as http  from 'http';
import * as fs from 'fs';
import * as dateFormat from 'dateformat';
import * as path from "path";
import * as  https from 'https'

const patternDate = '(\\d{4})(\\d{2})(\\d{2})(\\d{2})(\\d{2})';


const getConsoleKey = (key: string): string | undefined =>{
    const regexp = new RegExp('\-\-'.concat(key).concat('$'))
    const index = process.argv.findIndex(it  => it.match(regexp));
    if(index == -1) return;
    const value = process.argv[index+1]
    if (!value || value.match(/^\-\-/)) return
    return value
}

const rootDir = getConsoleKey('rootdir');
const irDir = path.resolve(__dirname, rootDir, 'img', 'ir')
const viDir = path.resolve(__dirname, rootDir, 'img', 'vi')
// 0 * * * * sh /home/max/www/borispol-radar2/server/cron.sh


class FileSystem{
    fs: any;
    constructor(){
        this.fs = fs;
    }
    unlink(filePath: string){
       return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) =>{
                if(err) return reject(err);
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
        ensureExists(path, parseInt("0777", 8), (err) => {
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
/*const a = creteDir(irDir)
    .then(irDir => {
        const d = new Date();
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
        return path.resolve(irDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
    })
    .then(fileName => {
        return writeFile("http://www.sat24.com/image2.ashx?region=eu&ir=true", fileName)
    })
    .then((fileName) => {
        console.log(`Success ${fileName}`);
        return fileName
    })
    .catch(err => {
        console.log(err);
        return null
    })
    .then(()=>{
        return new Promise((resolve)=>{
            const filesForDel: string[] = []
            fs.readdir(irDir, (err, files) => {
                files.forEach( (file: string) => {
                    const matches = file.match(new RegExp(patternDate)).slice(1);
                    if(matches[1]) matches[1]--;
                    const d: number = new Date(...matches).getTime();
                    if((new Date().getTime() - d) > 24*3600*1000){
                        filesForDel.push(file)
                    }
                    resolve(filesForDel)
                });
            })
        })

    })
    .then((filesForDel: string[])=>{
        console.log('filesForDel ->', filesForDel)
        return Promise.all(filesForDel.map((file: string)=>{
            return fileSystem.unlink(path.resolve(irDir, file))
        }))
    })
    .catch(err=>{
        console.error(err)
    });*/

/*const b = creteDir(viDir)
    .then(viDir => {
        const d = new Date();
        const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
        return path.resolve(viDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
    })
    .then(fileName => {
        return writeFile("https://en.sat24.com/image?type=visual&region=eu", fileName)
    })
    .then((fileName) => {
        console.log(`Success ${fileName}`)
        return fileName
    })
    .catch(err => {
        console.log(err)
    })
    .then(()=>{
        return new Promise((resolve)=>{
            const filesForDel: string[] = []
            fs.readdir(viDir, (err, files) => {
                files.forEach( (file: string) => {
                    const matches = file.match(new RegExp(patternDate)).slice(1);
                    if(matches[1]) matches[1]--;
                    const d: number = new Date(...matches).getTime();
                    if((new Date().getTime() - d) > 24*3600*1000){
                        filesForDel.push(file)
                    }
                    resolve(filesForDel)
                });
            })
        })

    })
    .then((filesForDel: string[])=>{
        console.log('filesForDel ->', filesForDel)
        return Promise.all(filesForDel.map((file: string)=>{
            return fileSystem.unlink(path.resolve(viDir, file))
        }))
    })
    .catch(err=>{
        console.error(err)
    });*/


const buildImage = ({
                        srcDir,
                        networkUrl
                    }) => {

    const viDir = srcDir
    return creteDir(viDir)
        .then(viDir => {
            const d = new Date();
            const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours())
            return path.resolve(viDir, dateFormat(dd, 'yyyymmddHH').concat('00.gif'))
        })
        .then(fileName => {
            return writeFile(networkUrl, fileName)
            // return writeFile("https://en.sat24.com/image?type=visual&region=eu", fileName)
        })
        .then((fileName) => {
            console.log(`Success ${fileName}`)
            return fileName
        })
        .catch(err => {
            console.log(err)
        })
        .then(()=>{
            return new Promise((resolve)=>{
                const filesForDel: string[] = []
                fs.readdir(viDir, (err, files) => {
                    files.forEach( (file: string) => {
                        const matches = file.match(new RegExp(patternDate)).slice(1);
                        if(matches[1]) matches[1]--;
                        const d: number = new Date(...matches).getTime();
                        if((new Date().getTime() - d) > 24*3600*1000){
                            filesForDel.push(file)
                        }
                        resolve(filesForDel)
                    });
                })
            })

        })
        .then((filesForDel: string[])=>{
            console.log('filesForDel ->', filesForDel)
            return Promise.all(filesForDel.map((file: string)=>{
                return fileSystem.unlink(path.resolve(viDir, file))
            }))
        })
        .catch(err=>{
            console.error(err)
            return Promise.reject(err)
        });
}

const streamA = buildImage({
    srcDir: irDir,
    networkUrl: 'https://en.sat24.com/image?type=visual&region=eu'
})

const streamB = buildImage({
    srcDir: viDir,
    networkUrl: 'http://www.sat24.com/image2.ashx?region=eu&ir=true'
})

