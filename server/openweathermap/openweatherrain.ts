import * as Jimp from 'jimp'
import * as dateFormat from 'dateformat';
const appid = '19e738728f18421f2074f369bdb54e81';

const getMin = (date: number, offset): string => {
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
const loadRadar = (count: number) => {
    console.log(count)
    let date = new Date();
    const ddate = date.getTime() + date.getTimezoneOffset()*60*1000;
    const offset = count * 10 * 60 *1000;
    const day = dateFormat(ddate, 'yyyy-mm-dd').concat('T').concat(dateFormat(ddate, 'HH')).concat(':',getMin(ddate, offset));
    const query = `appid=${appid}&day=${day}`;
    return Promise.all(
        [
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/74/42?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/75/42?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/74/43?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/75/43?${query}`),
        ]
    )
        .catch(err => {
            if(count<5){
                return loadRadar(count+1)
            }
            return Promise.reject(err)
        })

};

export const rain = (req: any, res: any, next: any) => {
    loadRadar(0).then(([image1, image2, image3, image4]) => {
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
