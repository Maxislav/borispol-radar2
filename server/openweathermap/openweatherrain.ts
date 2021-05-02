import * as Jimp from 'jimp'
import * as dateFormat from 'dateformat';
const appid = '19e738728f18421f2074f369bdb54e81';

const getMin = (date: number): string => {
   let m =  new Date(date-10*60*1000).getMinutes();
   while (m%10){
       m-=1
   }
   if(m<10){
       return `0${m}`
   }
   return `${m}`;
};

export const rain = (req: any, res: any, next: any) => {
    let date = new Date();
    const ddate = date.getTime() + date.getTimezoneOffset()*60*1000
    const day = dateFormat(ddate, 'yyyy-mm-dd').concat('T').concat(dateFormat(ddate, 'HH')).concat(':',getMin(ddate))
    // https://c.sat.owm.io/maps/2.0/radar/7/72/41?appid=9de243494c0b295cca9337e1e96b00e2&day=2021-05-02T17:10
    const query = `appid=${appid}&day=${day}`;
    Promise.all(
        [
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/74/42?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/75/42?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/74/43?${query}`),
            Jimp.read(`https://c.sat.owm.io/maps/2.0/radar/7/75/43?${query}`),
        ]
    ).then(([image1, image2, image3, image4]) => {
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
                    res.sendError('ds');
                });
        });

}
