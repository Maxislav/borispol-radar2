"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rain = void 0;
const Jimp = require("jimp");
const dateFormat = require("dateformat");
const es6_promise_1 = require("../../node_modules/es6-promise");
const https = require("https");
const appid = '19e738728f18421f2074f369bdb54e81';
function httpGet(url, count = 0) {
    return new es6_promise_1.Promise((res, rej) => {
        https.get(url, (resp) => {
            const chunks = [];
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
            resp.on('end', () => {
                const response = Buffer.concat(chunks);
                if (!response.length) {
                    return rej(new Error('empty body'));
                }
                res(response);
            });
            resp.on('error', function (err) {
                rej(err);
            });
        });
    });
}
const getMin = (date) => {
    let m = new Date(date).getMinutes();
    while (m % 10) {
        m -= 1;
    }
    if (m < 10) {
        return `0${m}`;
    }
    return `${m}`;
};
//https://b.sat.owm.io/maps/2.0/radar/7/75/43?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T22:00
function jimpCreate256() {
    return new es6_promise_1.Promise((resolve) => {
        new Jimp(512, 512, (err, image) => {
            resolve(image);
        });
    });
}
function jimRead(url, count) {
    let d = new Date();
    const offset = (count - 1) * 10 * 60 * 1000 + 10 * 60 * 1000;
    const date = d.getTime() + d.getTimezoneOffset() * 60 * 1000 - offset;
    const day = dateFormat(date, 'yyyy-mm-dd').concat('T').concat(dateFormat(date, 'HH')).concat(':', getMin(date));
    const query = `appid=${appid}&day=${day}`;
    const path = `${url}?${query}`;
    return httpGet(path)
        .then((buffer) => {
        return Jimp.read(buffer)
            .then(img => {
            console.info('success img will be for    ', path);
            return img;
        })
            .catch((err) => {
            console.warn('transparent img will be for', path);
            return jimpCreate256();
        });
    });
}
const loadRadar = (step) => {
    return es6_promise_1.Promise.all([
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/42`, step),
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/42`, step),
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/42`, step),
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/43`, step),
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/43`, step),
        jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/43`, step),
    ])
        .catch(err => {
        console.error(err);
        return es6_promise_1.Promise.reject(err);
    });
};
const rain = (req, res, next) => {
    const stepBack = Number(req.params.step || 0);
    loadRadar(stepBack).then(([image1, image2, image3, image4, image5, image6]) => {
        new Jimp(768, 512, (err, image) => {
            if (err) {
                res.status(500);
                res.send('error', { error: err });
                return;
            }
            // this image is 256 x 256, every pixel is set to 0x00000000
            const srcImage = image
                .composite(image1, 0, 0)
                .composite(image2, 256, 0)
                .composite(image3, 512, 0)
                .composite(image4, 0, 256)
                .composite(image5, 256, 256)
                .composite(image6, 512, 256)
                .crop(128, 0, 640, 512);
            const srcColor1 = Jimp.intToRGBA(0xFA64ff);
            const srcColor2 = Jimp.intToRGBA(0xE600ff);
            const srcColor3 = Jimp.intToRGBA(0xBA00ff);
            srcImage.scan(0, 0, srcImage.bitmap.width, srcImage.bitmap.height, function (x, y, idx) {
                // do your stuff..
                const r = this.bitmap.data[idx + 0];
                const g = this.bitmap.data[idx + 1];
                const b = this.bitmap.data[idx + 2];
                const a = this.bitmap.data[idx + 3];
                if (match(srcColor1, r, g, b)) {
                    //   const c = Jimp.rgbaToInt(r, g, b, a)
                    this.bitmap.data[idx + 3] = 100;
                }
                if (50 < g && r < 100) {
                    this.bitmap.data[idx + 1] = this.bitmap.data[idx + 1] - 80;
                    this.bitmap.data[idx + 2] = 255;
                }
                if (match(srcColor1, r, g, b)) {
                    //   const c = Jimp.rgbaToInt(r, g, b, a)
                    // this.bitmap.data[idx + 3] = 180;
                }
                if (match(srcColor3, r, g, b)) {
                    /*   this.bitmap.data[idx + 0] = 66;
                       this.bitmap.data[idx + 1] = 136;
                       this.bitmap.data[idx + 2] = 229;
                       this.bitmap.data[idx + 3] = 255;
   */
                }
            }, (err) => {
                if (err) {
                    console.error('err scan ->>');
                    res.status(500);
                    res.send('error', { error: err });
                    return;
                }
                srcImage.getBufferAsync(Jimp.MIME_PNG)
                    .then(buffer => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Content-Type", "image/png");
                    res.send(buffer);
                })
                    .catch(err => {
                    console.error('err composite ->>');
                    res.status(500);
                    res.send('error', { error: err });
                });
            });
        });
    })
        .catch(err => {
        console.error('err composite', 'c.sat.owm.io/maps/2.0/radar');
        res.status(500);
        res.send('error', { error: err });
    });
};
exports.rain = rain;
function match(srcColor, r, g, b) {
    return r < srcColor.r + 10 && srcColor.r - 10 < r && g < srcColor.g + 10 && srcColor.g - 10 < g && b < srcColor.b + 10 && srcColor.b - 10 < b;
}
//# sourceMappingURL=openweatherrain.js.map