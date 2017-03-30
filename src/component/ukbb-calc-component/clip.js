import {xy} from './get-direction';


export class Clip{
    constructor(c, image){
        const canvas = this.canvas = c.cloneNode(false);
        document.body.appendChild(canvas);
        this.image = image;
        this.context = canvas.getContext('2d');


    }
    getImageData(center, a){
        const  ctx = this.context;
        const p1 = xy(center, a-15);
        const p2 = xy(center, a+15);

        ctx.save();
        ctx.beginPath();

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = 'rgba(255,0,0,0.1)';
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(this.image, 0,0);

        const imageData = ctx.getImageData(0, 0, 500, this.canvas.height );
        const data = [];
        const width = 500 ;
        for(let i = 0; i<imageData.data.length; i+=4){
            const d = imageData.data;
            const y = Math.floor(i/(width*4));
            const x = i/4 - (y)*width;
            if(!data[x] ){
                data.push([])
            }
            try{
                data[x].push({
                    r:d[i],
                    g:d[i+1],
                    b:d[i+2],
                    a:d[i+3]
                })
            }catch (err){
                console.log(x, data)
            }
        }
        return imageData

    }
}

export function clip(c, image, center, a) {
    const canvas = c.cloneNode(false);
    document.body.appendChild(canvas);
    const  context = canvas.getContext('2d');
    context.save();
    context.beginPath();


    const ctx = context;

    const p1 = xy(center, a-15);
    const p2 = xy(center, a+15);



    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,0,0,0.1)';
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    context.clip();
    context.drawImage(image, 0,0);


    return context.getImageData(0, 0, 500, canvas.height )

}
