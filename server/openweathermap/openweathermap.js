"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
const http = require("http");
const es6_promise_1 = require("../../node_modules/es6-promise");
const Jimp = require('jimp');
// 'APPID=19e738728f18421f2074f369bdb54e81'
// https://c.sat.owm.io/maps/2.0/radar/7/72/41?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T17:10
const map = (req, res, next) => {
    // httpGet('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png')
    es6_promise_1.Promise.all([
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/73/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/73/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
    ])
        .then(([image1, image2, image3, image4, image5, image6,]) => {
        new Jimp(768, 512, (err, image) => {
            // this image is 256 x 256, every pixel is set to 0x00000000
            image
                .composite(image1, 0, 0)
                .composite(image2, 256, 0)
                .composite(image3, 512, 0)
                .composite(image4, 0, 256)
                .composite(image5, 256, 256)
                .composite(image6, 512, 256)
                .crop(128, 0, 640, 512)
                .getBufferAsync(Jimp.MIME_PNG)
                .then((buffer) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Content-Type", "image/png");
                res.send(buffer);
            })
                .catch((err) => {
                console.error('err composite');
                res.status(500);
                res.render('error', { error: err });
            });
        });
    })
        .catch(err => {
        console.error('err composite', 'cartodb-basemaps-b.global', err);
        res.status(500);
        res.render('error', { error: err });
    });
};
exports.map = map;
//# sourceMappingURL=openweathermap.js.map