import * as Jimp from 'jimp'
import * as dateFormat from 'dateformat';
import {Promise} from '../../node_modules/es6-promise';
import {IncomingMessage} from "http";
import * as https from "https";

const appid = '19e738728f18421f2074f369bdb54e81';

function httpGet(url: string, count = 0): Promise<Buffer> {
    return new Promise((res: any, rej: any) => {
        https.get(url, (resp: IncomingMessage) => {
            const chunks: Uint8Array[] = [];
            resp.on('data', (chunk: Uint8Array) => {
                chunks.push(chunk)
            });

            resp.on('end', () => {
                const response = Buffer.concat(chunks);
                if (!response.length) {
                    return rej(new Error('empty body'))
                }
                res(response)
            });
            resp.on('error', function (err: Error) {
                rej(err)
            });
        })
    })
}

const getMin = (date: number): string => {
    let m = new Date(date).getMinutes();
    while (m % 10) {
        m -= 1
    }
    if (m < 10) {
        return `0${m}`
    }
    return `${m}`;
};

//https://b.sat.owm.io/maps/2.0/radar/7/75/43?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T22:00

function jimpCreate256() {
    return new Promise((resolve) => {
        new Jimp(512, 512, (err, image) => {
            resolve(image)
        })
    })
}

function jimRead(url: string, count: number) {
    let d = new Date();
    const offset = (count-1) * 10 * 60 * 1000 + 10 * 60 * 1000;
    const date = d.getTime() + d.getTimezoneOffset() * 60 * 1000 - offset;

    const day = dateFormat(date, 'yyyy-mm-dd').concat('T').concat(dateFormat(date, 'HH')).concat(':', getMin(date));
    const query = `appid=${appid}&day=${day}`;
    const path = `${url}?${query}`;
    return httpGet(path)
        .then((buffer: Buffer) => {
            return Jimp.read(buffer)
                .then(img => {
                    console.info('success img will be for    ', path);
                    return img;
                })
                .catch((err: Error) => {
                    console.warn('transparent img will be for', path);
                    return jimpCreate256()
                })
        })

}

const loadRadar = (step: number) => {

    return Promise.all(
        [
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/42`, step),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/42`, step),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/42`, step),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/43`, step),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/43`, step),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/43`, step),
        ]
    )
        .catch(err => {
            console.error(err);
            return Promise.reject(err)
        })

};

export const rain = (req: any, res: any, next: any) => {
    const stepBack = Number(req.params.step || 0);
    loadRadar(stepBack).then(([
                                  image1,
                                  image2,
                                  image3,
                                  image4,
                                  image5,
                                  image6
                              ]) => {
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
                .then(buffer => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Content-Type", "image/png");
                    res.send(buffer);
                })
                .catch(err => {
                    console.error('err composite');
                    res.status(500);
                    res.send('error', {error: err});
                });
        });

    })
        .catch(err => {
            console.error('err composite', 'c.sat.owm.io/maps/2.0/radar');
            res.status(500);
            res.send('error', {error: err});
        })

}
