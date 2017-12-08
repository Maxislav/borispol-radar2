import defineload from "../../util/defineload";
/**
 * @type {THREE}
 */
let THREE = undefined;


export function init() {
  if(!THREE){
    return defineload('THREE')
      .then(three=>{
        THREE = three;


        class EarthFace{
          constructor(face1, face2, faceVertexUvs , index, faceIndex){
            this.face1 = face1;
            this.face2 = face2;
            this.faceVertexUvs = faceVertexUvs;
            this.index = index;
            this.faceIndex = faceIndex;

            this.latMin = 0;
            this.latMax = 0;
            /** @type {number} */
            this.lngMin = 0;
            /** @type {number}*/
            this.lngMax = 0;
            /**
             * @type {number}
             */
            this.rowIndex = 0;
            /**
             * @type {number}
             */
            this.colIndex = 0;

            this.vertexCoord = new Array(4);

            this.materialIndex = 0;
            //console.log(index)
          }

          setMaterialIndex(i){
            this.face1.materialIndex = i;
            this.face2.materialIndex = i;
            this.materialIndex = i;
            return this;
          }


          uvsMaping(){
            const v = this.vertexCoord

            this.faceVertexUvs[this.faceIndex] = [
              new THREE.Vector2(v[2].x, v[2].y ),
              new THREE.Vector2(v[3].x, v[3].y),
              new THREE.Vector2(v[1].x, v[1].y)
            ];

            this.faceVertexUvs[this.faceIndex+1]  = [
              new THREE.Vector2(v[3].x, v[3].y),
              new THREE.Vector2(v[0].x, v[0].y),
              new THREE.Vector2(v[1].x, v[1].y)
            ]
          }
        }


        THREE.EarthGeometry = class extends THREE.SphereGeometry{
          constructor(radius, segments){
            super(radius, segments, segments+2);
            this.segments = segments;
            this.earhFaces = [];
            /**
             *
             * @type {{lng: number, lat: number}}
             */
            this.screenLngLat = {
              lng:0,
              lat:0
            }

           // this.faceIndex();




            const facesCount = this.segments;
            /* for(let i = 0 ; i<this.faces.length; i++ ){
             if(facesCount-1<i && i<this.faces.length-facesCount){
             this.faces[i].materialIndex = 1
             }
             }*/
            let k = 0;
            const faceVertexUvs = this.faceVertexUvs[0]
            for (let i = 0; i< this.faces.length; i+=2){
              if(facesCount-1<i && i<this.faces.length-facesCount){
                const  earthFace = new EarthFace(this.faces[i], this.faces[i+1], faceVertexUvs, k, i);
                this.earhFaces.push(earthFace);
                k++;

                /*faceVertexUvs[i] = [
                 new THREE.Vector2(1, 1),
                 new THREE.Vector2(0, 1),
                 new THREE.Vector2(1, 0)];

                 faceVertexUvs[i+1] = [
                 new THREE.Vector2(0, 1),
                 new THREE.Vector2(0, 0),
                 new THREE.Vector2(1, 0),
                 ];*/
              }
            }

            this.earhFaces.forEach((earthFace, i) =>{
              const dLat = 180/(segments+2);
              const dLng = 360/segments;
              earthFace.rowIndex = parseInt(i/segments);
              earthFace.colIndex = i - (earthFace.rowIndex*segments);

              earthFace.lngMin =  earthFace.colIndex * dLng;
              earthFace.lngMax =  (earthFace.colIndex+1) * dLng;
              if(180<=earthFace.lngMin){
                earthFace.lngMin =  earthFace.lngMin - 360;
                earthFace.lngMax = earthFace.lngMax - 360;
              }
              earthFace.latMin = 90 - (earthFace.rowIndex+1)*dLat;
              earthFace.latMax = 90 - (earthFace.rowIndex+2)*dLat;
              earthFace.vertexCoord[0] = {
                x: this.getX(earthFace.lngMin, 0)/256,
                y: 1 - this.getY(earthFace.latMax, 0)/256
              }
              earthFace.vertexCoord[1] = {
                x: this.getX(earthFace.lngMax, 0)/256,
                y: 1 - this.getY(earthFace.latMax, 0)/256
              }
              earthFace.vertexCoord[2] = {
                x: this.getX(earthFace.lngMax, 0)/256,
                y: 1 - this.getY(earthFace.latMin, 0)/256
              }

              earthFace.vertexCoord[3] = {
                x: this.getX(earthFace.lngMin, 0)/256,
                y: 1- this.getY(earthFace.latMin, 0)/256
              }
              earthFace.uvsMaping();


              earthFace.setMaterialIndex(1)
            })
          }

          setScreenLngLat(lng, lat){
            this.screenLngLat.lng = lng;
            this.screenLngLat.lat = lat;

            const earthFace = this.earhFaces.find(face=>{
              return face.lngMin<lng && lng<face.lngMax && face.latMax<lat && lat<face.latMin
            })

            console.log(earthFace)
            if(earthFace){
              earthFace.setMaterialIndex(0)

            }

          }



          getX(lngMin, zoom) {
            return (Math.radians(lngMin)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
          }
          getY(latMin, zoom) {
            return (Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(latMin/2) )  ))* Math.pow(2, zoom)*128/Math.PI
          }

        };
        return three
      })
  }

  return Promise.resolve(THREE)

}
