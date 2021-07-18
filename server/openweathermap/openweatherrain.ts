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
    const offset = (count - 1) * 10 * 60 * 1000 + 10 * 60 * 1000;
    const date = d.getTime() + d.getTimezoneOffset() * 60 * 1000 - offset;

    const day = dateFormat(date, 'yyyy-mm-dd').concat('T').concat(dateFormat(date, 'HH')).concat(':', getMin(date));
    const query = `appid=${appid}&day=${day}`;
    const path = `${url}?${query}`;
    return httpGet(path)
        .then((buffer: Buffer) => {
            if(!buffer?.length){
                console.error('buffer null ->>>');
                return  Promise.reject('err')
            }
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
    const myImg: {img?: Jimp} = {img: null};
    loadRadar(stepBack).then(([
                                  image1,
                                  image2,
                                  image3,
                                  image4,
                                  image5,
                                  image6
                              ]) => {


        new Jimp(768, 512, (err, image: Jimp) => {
            if(err){
                res.status(500);
                res.send('error', {error: err});
                return;
            }
            if(!image1 || !image2 || !image3 || !image4 || !image5 || !image6){
                res.send('error', {error: 'some image null'});
                return;
            }
            // this image is 256 x 256, every pixel is set to 0x00000000
            myImg.img = image
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
            myImg.img.scan(0, 0, myImg.img.bitmap.width, myImg.img.bitmap.height, function (x, y, idx) {
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
                    this.bitmap.data[idx + 2] = 255
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
                if(err){
                    console.error('err scan ->>');
                    res.status(500);
                    res.send('error', {error: err});
                    return;
                }
                myImg.img.getBufferAsync(Jimp.MIME_PNG)
                    .then(buffer => {
                        res.header("Access-Control-Allow-Origin", "*");
                        res.header("Content-Type", "image/png");
                        res.send(buffer);
                        delete myImg.img;
                    })
                    .catch(err => {
                        console.error('err composite ->>');
                        res.status(500);
                        res.send('error', {error: err});
                    });
            });


        });

    })
        .catch(err => {
            console.error('err composite', 'c.sat.owm.io/maps/2.0/radar');
            res.status(500);
            res.send('error', {error: err});
            delete myImg.img
        })

};


function match(srcColor, r: number, g: number, b: number) {
    return r < srcColor.r + 10 && srcColor.r - 10 < r && g < srcColor.g + 10 && srcColor.g - 10 < g && b < srcColor.b + 10 && srcColor.b - 10 < b
}
