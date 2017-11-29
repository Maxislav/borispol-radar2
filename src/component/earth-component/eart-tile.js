import {getImageWorker, getImage, Canvas} from "../../util/load-image-blob";

function getX(lngMin, zoom) {
  return (Math.radians(lngMin)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
}

function getY(latMin, zoom) {
  return (Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(latMin/2) )  ))* Math.pow(2, zoom)*128/Math.PI
}

function getXN(xMin, yMin, zoom) {
  let xN = parseInt(xMin/256);
  let yN = parseInt(yMin/256);

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

export function getTile({lngMin, lngMax, latMin, latMax}) {
  const zoom = 4;
  const xMin = getX(lngMin, zoom)// (Math.radians(lngMin)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
  const yMin = getY(latMin,zoom)//    Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(latMin/2) )  ))* Math.pow(2, zoom)*128/Math.PI

  const xMax = getX(lngMax, zoom)
  const yMax = getY(latMax, zoom)

  const width = xMax - xMin;
  const height =  yMin -yMax
  //console.log(height)

  let n1 = getXN(xMin, yMin, zoom);
  let n2 = getXN(xMax, yMax, zoom);


 const tiles = getNeighbor(n1, zoom, 2);






 return Promise.all(tiles.map(tile=>{
   return getImageWorker(`https://maps.tilehosting.com/data/satellite/${tile.z}/${tile.x}/${tile.y}.jpg?key=SoGrAH8cEUtj6OnMI1UY`)
 }))
   .then((imgList)=>{

     const canvas = new Canvas(512, 512);
     canvas.drawImage(imgList[0], 0, 0)
     canvas.drawImage(imgList[1], 256, 0);
     canvas.drawImage(imgList[2], 0,256 );
     canvas.drawImage(imgList[2], 256,256 );
     return canvas.getImage()
       .then(img=>{
         const x = (xMin/256) - parseInt(xMin/256);
         const y = (yMin/256)- parseInt(yMin/256);
         const canvas = new Canvas(width, height)
         canvas.drawImage(img, x, y)
         return canvas.getImage()

       })
       .then(img=>{
         const canvas = new Canvas(256, 256)
         canvas.drawImage(img, 0, 0, 256, 256)
         return canvas.getImage()
       })


   })




  //getImageWorker
}
