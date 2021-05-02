"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const Jimp = require('jimp');
// 'APPID=19e738728f18421f2074f369bdb54e81'
// https://c.sat.owm.io/maps/2.0/radar/7/72/41?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T17:10
exports.map = (req, res, next) => {
    // httpGet('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png')
    Promise.all([
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/42.png'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/43.png'),
        Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/43.png'),
    ])
        .then(([image1, image2, image3, image4]) => {
        new Jimp(512, 512, (err, image) => {
            // this image is 256 x 256, every pixel is set to 0x00000000
            image.composite(image1, 0, 0)
                .composite(image2, 256, 0)
                .composite(image3, 0, 256)
                .composite(image4, 256, 256)
                .getBufferAsync(Jimp.MIME_PNG)
                .then(buffer => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Content-Type", "image/png");
                res.send(buffer);
            })
                .catch(err => {
                console.error('err composite');
                res.status(500);
                res.render('error', { error: err });
            });
        });
    })
        .catch(err => {
        console.error('err composite', 'cartodb-basemaps-b.global');
        res.status(500);
        res.render('error', { error: err });
    });
};
//# sourceMappingURL=openweathermap.js.map