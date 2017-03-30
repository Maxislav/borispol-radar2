export function pixelArray(imageData) {
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
    return data;
}


export class PixelData{
    constructor(x,y, rgba){
        this.x = x;
        this.y = y;
        this.rgba = rgba;
        for(let opt in rgba){
            this[opt] = rgba[opt]
        }
        this.dist = null;
        this.hex = this._rgbToHex();
        this.colorHex = '#'+ this.hex;
        this.colorDec = parseInt(this.hex, 16)



    }


    _rgbToHex(){
        let hex = '';
        for(let opt in this.rgba){
            if(opt!='a'){
                let c = this.rgba[opt].toString(16);
                if (c.length<2) c = '0'+c;
                hex+=c
            }
        }
        return hex;
    }

    distFrom(x, y){
        const X = Math.abs(x-this.x);
        const Y = Math.abs(y-this.y);
        this.dist = Math.pow( Math.pow(X, 2)+ Math.pow(Y, 2), 1/2)*(200/470);

        return this.dist
    }



}


export function toRain(data, rain){
    data.forEach((d, x)=>{
        d.forEach((obj, y)=>{
            if(obj.r!=obj.g){
                rain.push(new PixelData(x,y,obj))
            }
        })
    });
}