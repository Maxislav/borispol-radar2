import * as Jimp from 'jimp'
import * as dateFormat from 'dateformat';
import { Promise } from '../../node_modules/es6-promise';
const appid = '19e738728f18421f2074f369bdb54e81';

const getMin = (date: number, offset: number): string => {
   let m =  new Date(date-10*60*1000 - offset).getMinutes();
   while (m%10){
       m-=1
   }
   if(m<10){
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
    let date = new Date();
    const offset = count * 10 * 60 *1000;
    const ddate = date.getTime() + date.getTimezoneOffset()*60*1000 - offset;

    const day = dateFormat(ddate, 'yyyy-mm-dd').concat('T').concat(dateFormat(ddate, 'HH')).concat(':',getMin(ddate, offset));
    const query = `appid=${appid}&day=${day}`;
    return Jimp.read(`${url}?${query}`)
        .catch(err => {
            if(count<5){
                return jimRead(url, count+1)
            }
            else {
                return  jimpCreate256()
            }
        })
}
const loadRadar = () => {

    return Promise.all(
        [
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/42`, 0),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/42`, 0),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/42`, 0),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/73/43`, 0),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/74/43`, 0),
            jimRead(`https://c.sat.owm.io/maps/2.0/radar/7/75/43`, 0),
        ]
    )
        .catch(err => {
            console.error(err)
            return Promise.reject(err)
        })

};

export const rain = (req: any, res: any, next: any) => {
    loadRadar().then(([
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
                .getBufferAsync(Jimp.MIME_PNG)
                .then(buffer => {
                    res.header("Access-Control-Allow-Origin", "*");
                    res.header("Content-Type", "image/png");
                    res.send(buffer);
                })
                .catch(err => {
                    console.error('err composite');
                    res.status(500);
                    res.send('error', { error: err });
                });
        });

    })
        .catch(err => {
            console.error('err composite', 'c.sat.owm.io/maps/2.0/radar');
            res.status(500);
            res.send('error', { error: err });
        })

}
