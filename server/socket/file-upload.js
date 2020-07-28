"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
//import * as Jimp from "jimp";
const Jimp = require('jimp');
const fs = require("fs");
const console_key_1 = require("../utils/console-key");
const es6_promise_1 = require("es6-promise");
const rootDir = console_key_1.getConsoleKey('rootdir') || '../';
const getFileList = (p) => {
    return new es6_promise_1.Promise((resolve, reject) => {
        fs.readdir(p, (err, fileList) => {
            if (err) {
                return reject(err);
            }
            es6_promise_1.Promise.all(fileList.map(f => {
                return new es6_promise_1.Promise((resolve, reject) => {
                    fs.lstat(path.resolve(p, f), (err, stat) => {
                        const resObj = { filename: f };
                        Object.setPrototypeOf(resObj, Object.getPrototypeOf(stat));
                        resolve(Object.assign(resObj, stat));
                    });
                });
            }))
                .then(resolve)
                .catch(err => {
                console.error('getFileList 1 err', err);
            });
        });
    });
};
exports.fileUpload = ({ file }) => {
    const pathToFile = path.resolve(__dirname, '../', rootDir, 'img/bg');
    return new es6_promise_1.Promise((resolve, reject) => {
        getFileList(pathToFile)
            .then((list) => {
            list.sort((a, b) => {
                return a.ctime - b.ctime;
            });
            const replaceFile = list[0].filename;
            Jimp.read(file, function (err, image) {
                if (err)
                    return reject(err);
                image.write(path.resolve(pathToFile, replaceFile), (err => {
                    if (err) {
                        console.error('getFileList error 3', err);
                        return reject(err);
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
//# sourceMappingURL=file-upload.js.map