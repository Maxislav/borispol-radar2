import Jimp from 'jimp'
import dateFormat from 'dateformat';
import {Promise} from '../../node_modules/es6-promise';
import {IncomingMessage} from 'http';
import http from 'http';

const appid = '19e738728f18421f2074f369bdb54e81';
const SRC_COLOR_1 = Jimp.intToRGBA(0xFA64ff);

function httpGet(url: string, count = 0): Promise<Buffer> {
    return new Promise((res: any, rej: any) => {
        const options = {
            port: 80,
            host: 'c.sat.owm.io',
            path: url,
            method: 'GET',
        };
        const proxyRequest = http.request(options);
        const chunks: Buffer[] = [];
        proxyRequest.on('response', function (proxyResponse) {
            proxyResponse.on('data', function (chunk: Buffer) {
                chunks.push(chunk)
            });
            proxyResponse.on('end', function () {
                // res.send(Buffer.concat(chunks))
                res(Buffer.concat(chunks))
            });
        });
        proxyRequest.on('error', function (err) {
            console.error('proxyOpenRain history err3 ->'.red, err);
            rej(err)
        });
        proxyRequest.end();
        /*req.on('data', function (chunk) {
            proxyRequest.write(chunk, 'binary');
        });
        req.on('end', function () {
            proxyRequest.end();
        });*/

        /*http.request(options, (resp: IncomingMessage) => {
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
        })*/
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
            if (!buffer?.length) {
                console.error('buffer null ->>>');
                return Promise.reject('err')
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
            jimRead(`/maps/2.0/radar/7/73/42`, step),
            jimRead(`/maps/2.0/radar/7/74/42`, step),
            jimRead(`/maps/2.0/radar/7/75/42`, step),
            jimRead(`/maps/2.0/radar/7/73/43`, step),
            jimRead(`/maps/2.0/radar/7/74/43`, step),
            jimRead(`/maps/2.0/radar/7/75/43`, step),
        ]
    )
        .catch(err => {
            console.error(err);
            return Promise.reject(err)
        })

};

class Wait {
    public list: any[] = [];
    private isRunning = false;

    public push(a: () => Promise<Buffer>) {
        this.list.push(a);
        this.run()
    }

    private run() {
        if (this.isRunning) {
            return
        }
        if (this.list.length) {
            this.isRunning = true;
            const [first] = this.list.splice(0, 1);
            first()
                .then(() => {
                    setTimeout(() => {
                        this.isRunning = false;
                        this.run()
                    }, 5)
                })
        }
    }
}

const wait = new Wait();

const COLOR_LIST = [
    ffToRgb('#00FA64'),
    ffToRgb('#00E600'),
    ffToRgb('#00D300'),
    ffToRgb('#00BA00'),
    ffToRgb('#00A000'),
    ffToRgb('#008C00'),
    ffToRgb('#007800')
];

const OPACITY_LIST = [
    80,
    120,
    130,
    180,
    220,
    230,
    250,
];

console.log(ffToRgb('#00a000'))

const replaceColor = (imageList: Jimp[]) => {
    const [
        image1,
        image2,
        image3,
        image4,
        image5,
        image6
    ] = imageList;
    const myImg: { img?: Jimp } = {img: null};
    return new Promise<Buffer>((resolve, reject) => {
        new Jimp(768, 512, (err, image: Jimp) => {
            if (err) {
                return reject(err);
            }
            if (!image1 || !image2 || !image3 || !image4 || !image5 || !image6) {
                return reject(new Error('some image null'));
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


            myImg.img.scan(0, 0, myImg.img.bitmap.width, myImg.img.bitmap.height, function (x, y, idx) {
                /*const r = this.bitmap.data[idx + 0];
                const g = this.bitmap.data[idx + 1];
                const b = this.bitmap.data[idx + 2];
                const a = this.bitmap.data[idx + 3];*/
                const [r, g, b, a] = [0, 1, 2, 3].map((i) => {
                    return this.bitmap.data[idx + i]
                });
                this.bitmap.data[idx + 3] = getOpacity([r, g, b, a]);
                if (50 < g && r < 100) {
                    this.bitmap.data[idx + 1] = this.bitmap.data[idx + 1] - 80;
                    this.bitmap.data[idx + 2] = 255;
                    // this.bitmap.data[idx + 3] = 180;
                }

            }, (err) => {
                if (err) {
                    return reject(new Error('err scan ->>'));
                }
                myImg.img.getBufferAsync(Jimp.MIME_PNG)
                    .then((buffer: Buffer) => {
                        return resolve(buffer)
                    })
                    .catch(err => {
                        console.error('err composite ->>');
                        reject(new Error('err composite ->>'))
                    });
            });
        });
    })
};


export const rain = (req: any, res: any, next: any) => {
    const stepBack = Number(req.params.step || 0);
    const myImg: { img?: Jimp } = {img: null};

    const a = (): Promise<Buffer> => {
        return loadRadar(stepBack)
            .then((imgList: Jimp[]) => {
                return replaceColor(imgList)
            })
            .then((buffer: Buffer) => {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Content-Type", "image/png");
                res.send(buffer);
                return Promise.resolve(buffer)
            })
            .catch(err => {
                console.error(err);
                res.status(500);
                res.send('error', {error: err});
                delete myImg.img;
                return null;
            })
    };
    wait.push(a)


};

function ffToRgb(color: string) {
    const [colorPars] = color.match(/[^#].+/g) || [null];
    const colorArr = colorPars ? Array.from(colorPars) : [];
    if (colorArr.length) {
        const r = colorArr.splice(0, 2).join('');
        const g = colorArr.splice(0, 2).join('');
        const b = colorArr.splice(0, 2).join('');
        return {r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)}
    } else return {r: 0, g: 0, b: 0}
}


function getOpacity(data: [number, number, number, number]): number {
    const [r, g, b, a] = data;
    let i = 255;
    const m = COLOR_LIST.some((color, index) => {
        i = index;
        return match(color, [r, g, b])
    });
    if (m) {
        return OPACITY_LIST[i]
    }
    return a;
}

function match(srcColor, data) {
    const [r, g, b, a] = data
    return r < srcColor.r + 10 && srcColor.r - 10 < r && g < srcColor.g + 10 && srcColor.g - 10 < g && b < srcColor.b + 10 && srcColor.b - 10 < b
}
