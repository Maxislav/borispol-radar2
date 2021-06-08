import {IncomingMessage} from "http";
import joinImages from 'join-images';

const http = require("http");
import * as https from 'https';
import DepreciatedJimp = require("jimp");
import {Promise} from "../../node_modules/es6-promise";

const Jimp = require('jimp');

// 'APPID=19e738728f18421f2074f369bdb54e81'
// https://c.sat.owm.io/maps/2.0/radar/7/72/41?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T17:10

export const map = (req: any, res: any, next: any) => {
    // httpGet('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png')
    Promise.all(
        [
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/73/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/42.png?appid=9de243494c0b295cca9337e1e96b00e2'),
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/73/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/74/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
            Jimp.read('https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/7/75/43.png?appid=9de243494c0b295cca9337e1e96b00e2'),
        ]
    )
        .then(([
                   image1,
                   image2,
                   image3,
                   image4,
                   image5,
                   image6,
               ]: any) => {

            new Jimp(768, 512, (err: Error | null, image: DepreciatedJimp) => {
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
                    .then((buffer: Buffer) => {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Content-Type", "image/png");
                        res.send(buffer)
                    })
                    .catch((err: Error) => {
                        console.error('err composite');
                        res.status(500);
                        res.render('error', {error: err});
                    })
            });
        })
        .catch(err => {

            console.error('err composite', 'cartodb-basemaps-b.global', err);
            res.status(500);
            res.render('error', {error: err});
        })
};
