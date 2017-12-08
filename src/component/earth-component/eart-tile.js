import {getImageWorker, getImage, Canvas} from "../../util/load-image-blob";

function getX(lngMin, zoom) {
  return (Math.radians(lngMin)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
}

function getY(latMin, zoom) {
  return (Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(latMin/2) )  ))* Math.pow(2, zoom)*128/Math.PI
}

function getXN(xMin, yMin, zoom) {
  let xN = parseInt(xMin/256);
  let yN = parseInt(yMin/256)+1;


  if(Math.pow(2, zoom)<=xN){
    xN = 0
  }

  if(Math.pow(2, zoom)<=yN){
    yN = 0
  }

  const n = yN*Math.pow(2,zoom)+xN

  return  {
    n,
    x: xN,
    y: yN,
    z: zoom
  }
}

let k = 0

/**
 *
 * @param {Image} canvas
 */
const modeRain = (img) =>{
  const  canvas = new Canvas(256, 256)
  canvas.drawImage(img, 0, 0);
  const imageData = canvas.getImageData(0, 0, 256, 256)
  for(let i = 0; i<imageData.data.length; i+=4){
    imageData.data[i+2] = 255;
    imageData.data[i+1] = 200;
    imageData.data[i] = 200;
    imageData.data[i+3] = imageData.data[i+3]*1.3
  }
  canvas.putImageData(imageData, 0, 0)
  k++;

  return canvas.getImage()

}



export const  getTiledImage = ({type = 'ground', zoom = 4}, loader) =>{
  return new Promise((resolve, reject)=>{
    const z = zoom;
    /**
     *
     * @type {Canvas}
     */
    const canvasGround = new Canvas(Math.pow(2, z)*256, Math.pow(2, z)*256)

    let groundNeeded = Math.pow(Math.pow(2, z),2) ;
    let groundLoad = groundNeeded;
    console.log(groundLoad);
    const applyTile = (z, x, y) =>{

      let url;

      if(type == 'ground'){
        url = `https://maps.tilehosting.com/data/satellite/${z}/${x}/${y}.jpg?key=SoGrAH8cEUtj6OnMI1UY`;
      }else if (type == 'rain'){
        url = `https://e.maps.owm.io/map/precipitation_new/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1&time=${Math.getRandom(0,10, true)}`
        //url = `https://maptiles.accuweather.com/accuweather/tiles/worldSat/f6ddc115e/1455/${z}/${x}_${y}.png`
      }

      getImageWorker(url, true)
        .then(img =>{
          if(type == 'rain'){
            return modeRain(img)
              .then(img=>{
                groundLoad--;
                canvasGround.drawImage(img, x*256 , y*256)
                return canvasGround
              })
          }
          groundLoad--;
          canvasGround.drawImage(img, x*256 , y*256)
          return canvasGround
        })
        .catch(err=>{
          groundLoad--;
          return canvasGround
        })
        .then((/**@type {Canvas}*/canvas)=>{
          loader && loader({canvas, load: 1 - (groundLoad/groundNeeded) })
          if(groundLoad==0){
            resolve(canvas.instance)
            /*canvas.getImage()
              .then(img=>{
                resolve(img)
              })*/
          }
        })
    }

    for(let y = 0; y<Math.pow(2, z); y++){
      for(let x = 0; x< Math.pow(2, z); x++ ){
        applyTile(z, x, y)
      }
    }
  })
}