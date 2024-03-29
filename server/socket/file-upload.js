"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const path = __importStar(require("path"));
//import * as Jimp from "jimp";
const Jimp = require('jimp');
const fs = __importStar(require("fs"));
const console_key_1 = require("../utils/console-key");
const es6_promise_1 = require("es6-promise");
const rootDir = console_key_1.getConsoleKey('rootdir') || '../dist';
const getFileList = (p) => {
    return new es6_promise_1.Promise((resolve1, reject1) => {
        fs.readdir(p, (err, fileList) => {
            if (err) {
                return reject1(err);
            }
            es6_promise_1.Promise.all(fileList.map(f => {
                return new es6_promise_1.Promise((resolve, reject) => {
                    fs.lstat(path.resolve(p, f), (error2, stat) => {
                        const resObj = { filename: f };
                        Object.setPrototypeOf(resObj, Object.getPrototypeOf(stat));
                        resolve(Object.assign(resObj, stat));
                    });
                });
            }))
                .then((r) => {
                resolve1(r);
            })
                .catch((error1) => {
                console.error('getFileList 1 err', error1);
                reject1(error1);
            });
        });
    });
};
const fileUpload = ({ file }) => {
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
                image.write(path.resolve(pathToFile, replaceFile), ((err4) => {
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
exports.fileUpload = fileUpload;
//# sourceMappingURL=file-upload.js.map