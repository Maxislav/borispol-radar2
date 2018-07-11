import * as path from "path";
//import * as Jimp from "jimp";
var Jimp = require("jimp");
import * as fs from 'fs';
import { getConsoleKey } from '../utils/console-key';
import {Promise} from 'es6-promise'
const rootDir = getConsoleKey('rootdir') || '../';



const getFileList = (p) => {
    return new Promise((resolve, reject) => {
        fs.readdir(p, (err, fileList) => {
            if(err){
               return reject(err)
            }

            Promise.all(fileList.map(f=>{
                return new Promise((resolve, reject) => {
                    fs.lstat(path.resolve(p, f), (err, stat) => {
                        const resObj = {filename: f}
                        Object.setPrototypeOf(resObj, Object.getPrototypeOf(stat))

                        resolve(Object.assign(resObj, stat))
                    })
                })
            }))
                .then(resolve)

        })
    })

}


export const fileUpload = ({file}): Promise<string> => {
    const pathToFile = path.resolve(__dirname, '../', rootDir, 'img/bg');
    return new Promise((resolve, reject) => {
        getFileList(pathToFile)
            .then((list: Array<any>) => {
                list.sort((a, b) => {
                    return a.ctime - b.ctime
                });
                const replaceFile: string = list[0].filename;
                Jimp.read(file, function (err, image) {
                    if(err) return reject(err);
                    image.write(path.resolve(pathToFile, replaceFile), (err => {
                        if (err) {
                            return reject(err)
                        }
                        console.log(`file save at -> ${path.resolve(pathToFile, replaceFile)}`)
                        resolve(replaceFile)
                    }))
                })
            })
            .catch(err => {
                return reject(err)
            })
    })
};