import * as path from 'path';
//import * as Jimp from "jimp";
const Jimp = require('jimp');
import * as fs from 'fs';
import { getConsoleKey } from '../utils/console-key';
import { Promise } from 'es6-promise';

const rootDir = getConsoleKey('rootdir') || '../dist';

const getFileList = (p: string) => {
    return new Promise((resolve1, reject1) => {
        fs.readdir(p, (err, fileList) => {
            if (err) {
                return reject1(err);
            }

            Promise.all(fileList.map(f => {
                return new Promise((resolve, reject) => {
                    fs.lstat(path.resolve(p, f), (error2, stat) => {
                        const resObj: any = {filename: f};
                        (<any>Object).setPrototypeOf(resObj, Object.getPrototypeOf(stat));

                        resolve((<any>Object).assign(resObj, stat));
                    });
                });
            }))
                .then((r) => {
                    resolve1(r)
                })
                .catch((error1) => {
                    console.error('getFileList 1 err', error1);
                    reject1(error1)
                })

        });
    });

};


export const fileUpload = ({file}: {file: any}): Promise<string> => {
    const pathToFile = path.resolve(__dirname, '../', rootDir, 'img/bg');
    return new Promise((resolve, reject) => {
        getFileList(pathToFile)
            .then((list: Array<any>) => {
                list.sort((a, b) => {
                    return a.ctime - b.ctime;
                });
                const replaceFile: string = list[0].filename;
                Jimp.read(file, function(err: Error | null, image: any) {
                    if (err) return reject(err);
                    image.write(path.resolve(pathToFile, replaceFile), ((err4: any) => {
                        if (err4) {
                            console.error('getFileList error 3', err4);
                            return reject(err4);
                        }
                        console.log(`file save at -> ${path.resolve(pathToFile, replaceFile)}`);
                        resolve(replaceFile);
                    }));
                });
            })
            .catch(err => {
                console.error('getFileList error 2', err);
                return reject(err);
            });
    });
};
