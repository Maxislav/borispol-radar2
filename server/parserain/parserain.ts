import {MathDate} from "./math-date.class";
import * as url from 'url';
import {Deferred} from "./deferred.class";
import * as Jimp from 'jimp';
//var Jimp = require("jimp");
import {ImageMatrix} from './image-matrix.class'
import {ImageColor} from './image-color.class'
import {UrlWithParsedQuery} from "url";
import {ParsedUrlQuery} from "querystring";

const path = 'http://meteoinfo.by/radar/UKBB/UKBB_latest.png';
const mathDate = new MathDate();
interface HashDate{
    [hashCode: string]: Deferred<any>
}

const hashDate:HashDate = {};

let I = 0;
export const parserain = (req, res, next) =>{
    I++;
    const url_parts: UrlWithParsedQuery = url.parse(req.url, true);
    /**
     * @type {{lat:number|undefined, lng:number|undefined }}
     */
    const query: ParsedUrlQuery = url_parts.query;
    const currentHash: string = mathDate.getCurrentDate().toISOString() + '.' + query.lat + '.' + query.lng;


    //const {lat: sting| number = '50.44701', lng = '30.49'} = query;

    const lat: string  =  query['lat'] ? query['lat'].toString() : '50.44701';
    const lng: string  = query['lng'] ? query['lng'].toString() : '30.49';

    if (!hashDate[currentHash]) {
        hashDate[currentHash] = new Deferred(I);

        Jimp.read(path, function (err, image) {
            if (err) {
                console.error('meteoinfo error->', err);
                hashDate[currentHash].reject(err);
                return;
            }

            image.crop(0, 0, 505, image.bitmap.height-1);
            const imageMatrix = new ImageMatrix(image.bitmap.width, image.bitmap.height);
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                const red = image.bitmap.data[idx];
                const green = image.bitmap.data[idx + 1];
                const blue = image.bitmap.data[idx + 2];
                const alpha = image.bitmap.data[idx + 3];
                const imageColor = new ImageColor(red, green, blue, alpha);
                imageColor.x = x;
                imageColor.y = y;
                imageMatrix[x][y] = imageColor;
            });

            /**
             * Удаление мусора
             */
            for(let x = 20; x<26; x++){
                for(let y = 460; y<480;y++){
                    imageMatrix[x][y] =  new ImageColor(204, 204, 204, 244);
                }
            }

            hashDate[currentHash].resolve({
                direction : imageMatrix.getDirection(),
                dist: imageMatrix.distByLatLng({lat: Number.parseFloat(lat), lng: Number.parseFloat(lng)}) ,
                isRainy: imageMatrix.isRainy()
            })

            imageMatrix.clear();
            hashDate[currentHash].resolve(res)
            setTimeout(()=>{
                delete hashDate[currentHash]
            }, 60000)

        })
    }
    return hashDate[currentHash]
        .promise
        .then((result: {direction: any, dist: any, isRainy: any}) => {
            const i = hashDate[currentHash].i;
            let ip =  req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            ip = ip.replace(/::f+:/, '');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result, null, 3));

            console.log('resolve ->', i, 'ip:', ip, {direction: result.direction, dist: result.dist.length? result.dist[0] :[], isRainy: result.isRainy })
            return true
        })
        .catch(err => {
            res.status(500).send({error: 'meteoinfo error'});
        })
};