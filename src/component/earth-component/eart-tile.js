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

function getNeighbor(tile, z, n) {
  //const count = Math.pow(n, 2)
  const max = Math.pow(2, z)

  const ll = []
  for(let dy = -n+1; dy<=0; dy++){
    for(let dx = 0; dx<n; dx++ ){
      let x = tile.x+dx;
      let y = tile.y+dy;
      if(x<0){
        x = max+x
      }
      if(max<=x){
        x = max-x
      }

      if(y<0){
        y = max+y
      }
      if(max<=y){
        y = max-y
      }


      ll.push({
        x: x,
        y: y,
        z
      })
    }
  }
  return ll

}


let k = 0

function contrast(canvas) {
  k++;

  var imgData =  canvas.getImageData(0, 0, canvas.width, canvas.height );




  for(let i = 3; i<imgData.data.length; i+=4){
    var cb = 0.7;
    var w1 = cb*255;
    var a = imgData.data[i];
    var  d = a - w1;
    if(0<d){
      a = a + Math.pow(2,d*0.8)
    }else {
      a = a - Math.pow(2,d*0.7)
    }
    if(a<0){
      a = 0
    }

    imgData.data[i] = parseInt(a)
  }
  canvas.putImageData(imgData, 0,0);
  return canvas
}


export function getTile({lngMin, lngMax, latMin, latMax, x, y, type}) {
  const zoom = 4;
  const maxxx = Math.pow(2,zoom)*256
  let widthLast;
  if(0<lngMin && lngMax<0){
    widthLast = getX(lngMin, zoom) - getX(-lngMax, zoom)
  }

  const xMin = getX(lngMin, zoom)// (Math.radians(lngMin)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
  const yMin = getY(latMin,zoom)//    Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(latMin/2) )  ))* Math.pow(2, zoom)*128/Math.PI
  const xMax = getX(lngMax, zoom)
  const yMax = getY(latMax, zoom)
  const width = Math.abs(xMax - xMin);
  const height = Math.abs(yMin - yMax);
  //console.log(height)

  let n1 = getXN(xMin, yMin, zoom);
  //let n2 = getXN(xMax, yMax, zoom);
  const tiles = getNeighbor(n1, zoom, 2);

  if(lngMin==180 && latMin==0){

  }

  if(n1.x == 8 && n1.y ==8){
    console.log(tiles)
  }

  function tileMarker(img, tile) {
    const canvas = new Canvas(256, 256);
    canvas.drawImage(img, 0, 0);
    canvas.fillText(`x=${tile.x}; y=${tile.y}`,65, 110)
    return canvas.getImage()
  }


 return Promise.all(tiles.map(tile=>{
   let url = ''

   if(type == 'ground'){
     url = `https://maps.tilehosting.com/data/satellite/${tile.z}/${tile.x}/${tile.y}.jpg?key=SoGrAH8cEUtj6OnMI1UY`
     //url = `http://c.tile.openstreetmap.org/${tile.z}/${tile.x}/${tile.y}.png`
   }else {
     url = `https://c.maps.owm.io/map/clouds_new/${tile.z}/${tile.x}/${tile.y}?appid=b1b15e88fa797225412429c1c50c122a1` //карта осадков
     //url = `https://f.maps.owm.io/map/precipitation_new/${tile.z}/${tile.x}/${tile.y}?appid=b1b15e88fa797225412429c1c50c122a1` //карта облачности
   }

   return getImageWorker(url)
    /* .then(img=>{
       return tileMarker(img, tile)
     })*/
 }))
   .then((imgList)=>{
     const canvas = new Canvas(512, 512);
     canvas.drawImage(imgList[0], 0, 0);
     canvas.drawImage(imgList[1], 256, 0);
     canvas.drawImage(imgList[2], 0,256 );
     canvas.drawImage(imgList[3], 256,256 );
     let x = xMin - n1.x*256
     if(maxxx<=x){
       x = 0
     }
     const y = 512- ((n1.y*256) - yMin+height)
     //console.log(x, y, width)
     //TODO рисует контур квадрата
    /* canvas
       .strokeStyle('green')
       .fillText(`${lngMin} ... ${lngMax}`, 10, 60)*/
       //.rect(x, y, widthLast ? widthLast : width, height)
     return canvas.getImage()
       .then(img=>{
         const  canvas = new Canvas(256, 256)
         canvas.drawImage(img, x, y,  widthLast ? widthLast : width, height, 0, 0 ,256, 256)
         /*if(type == 'ground')
           canvas
             .strokeStyle('white')
             .rect(0, 0, 256, 256)
             .fillText(`${lngMin}  ${lngMax}`,20, 200 );*/
         return canvas//.getImage()
       })
       .then(canvas =>{
         if(type == 'clouds'){
           return contrast(canvas).getImage()
         }
         return canvas.getImage()
       })
   })
}
