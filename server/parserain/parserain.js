"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_date_class_1 = require("./math-date.class");
const url = require("url");
const deferred_class_1 = require("./deferred.class");
const Jimp = require("jimp");
//var Jimp = require("jimp");
const image_matrix_class_1 = require("./image-matrix.class");
const image_color_class_1 = require("./image-color.class");
const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';
const mathDate = new math_date_class_1.MathDate();
const hashDate = {};
let I = 0;
exports.parserain = (req, res, next) => {
    I++;
    const url_parts = url.parse(req.url, true);
    /**
     * @type {{lat:number|undefined, lng:number|undefined }}
     */
    const query = url_parts.query;
    const currentHash = mathDate.getCurrentDate().toISOString() + '.' + query.lat + '.' + query.lng;
    //const {lat: sting| number = '50.44701', lng = '30.49'} = query;
    const lat = query['lat'] ? query['lat'].toString() : '50.44701';
    const lng = query['lng'] ? query['lng'].toString() : '30.49';
    if (!hashDate[currentHash]) {
        hashDate[currentHash] = new deferred_class_1.Deferred(I);
        Jimp.read(path, function (err, image) {
            if (err) {
                console.error('meteoinfo error->', err);
                hashDate[currentHash].reject(err);
                return;
            }
            if (!image || !image.crop) {
                return;
            }
            image.crop(0, 0, 505, image.bitmap.height - 1);
            const imageMatrix = new image_matrix_class_1.ImageMatrix(image.bitmap.width, image.bitmap.height);
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                const red = image.bitmap.data[idx];
                const green = image.bitmap.data[idx + 1];
                const blue = image.bitmap.data[idx + 2];
                const alpha = image.bitmap.data[idx + 3];
                const imageColor = new image_color_class_1.ImageColor(red, green, blue, alpha);
                imageColor.x = x;
                imageColor.y = y;
                imageMatrix[x][y] = imageColor;
            });
            /**
             * Удаление мусора
             */
            for (let x = 20; x < 26; x++) {
                for (let y = 460; y < 480; y++) {
                    imageMatrix[x][y] = new image_color_class_1.ImageColor(204, 204, 204, 244);
                }
            }
            hashDate[currentHash].resolve({
                direction: imageMatrix.getDirection(),
                dist: imageMatrix.distByLatLng({ lat: Number.parseFloat(lat), lng: Number.parseFloat(lng) }),
                isRainy: imageMatrix.isRainy()
            });
            imageMatrix.clear();
            hashDate[currentHash].resolve(res);
            setTimeout(() => {
                delete hashDate[currentHash];
            }, 60000);
        });
    }
    return hashDate[currentHash]
        .promise
        .then((result) => {
        const i = hashDate[currentHash].i;
        let ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        ip = ip.replace(/::f+:/, '');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result, null, 3));
        console.log('resolve ->', i, 'ip:', ip, { direction: result.direction, dist: result.dist.length ? result.dist[0] : [], isRainy: result.isRainy });
        return true;
    })
        .catch(err => {
        console.error('meteoinfo error', err);
        res.status(500).send({ error: 'meteoinfo error' });
    });
};
//# sourceMappingURL=parserain.js.map