import defineload from "../../util/defineload";
import {getTileLimit} from "./eart-tile";
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



        class  EarthGeometry extends THREE.SphereGeometry{
          constructor(radius, segments){
            super(radius, segments, segments+2);
            this.segments = segments;
            this.earhFaces = [];
            this.earthFacesHash = []
            this._defaultMaterialIndex = 4;
            /**
             *
             * @type {number}
             */
            this.zoom = 4;

            /**
             * @type {Array.<EarthFace>}
             */
            this.centralFaceList = [];

            /**
             * @private
             * @type{EarthFace}
             */
            this.centralFace

            /**
             *
             * @type {{lng: number, lat: number}}
             */
            this.screenLngLat = {
              lng:0,
              lat:0
            }
            const facesCount = this.segments;
            let k = 0;
            const faceVertexUvs = this.faceVertexUvs[0]
            for (let i = 0; i< this.faces.length; i+=2){
              if(facesCount-1<i && i<this.faces.length-facesCount){
                const  earthFace = new EarthFace(this.faces[i], this.faces[i+1], faceVertexUvs, k, i);
                this.earhFaces.push(earthFace);
                k++;
              }
            }

            this.earhFaces.forEach((earthFace, i) =>{
              const dLat = 180/(segments+2);
              const dLng = 360/segments;
              earthFace.rowIndex = parseInt(i/segments);
              earthFace.colIndex = i - (earthFace.rowIndex*segments);

              this.earthFacesHash[earthFace.colIndex] =  this.earthFacesHash[earthFace.colIndex] || []
              this.earthFacesHash[earthFace.colIndex][earthFace.rowIndex] = earthFace

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
              };
              earthFace.uvsMaping();
              earthFace.setMaterialIndex(this._defaultMaterialIndex)
            })

            //console.log(this.earthFacesHash)
          }

          setScreenLngLat(lng, lat, zoom){

            let needUpdate = false

            this.screenLngLat.lng = lng;
            this.screenLngLat.lat = lat;
            const centralFace = this.earhFaces.find(face=>{
              return face.lngMin<=lng && lng<face.lngMax && face.latMax<=lat && lat<face.latMin
            });
            if(!centralFace) return this;
            if(this.centralFace != centralFace ){
              this.centralFace = centralFace;
              needUpdate = true
            }
            if(this.zoom != zoom){
              this.zoom = zoom;
              needUpdate = true
            }
            if(needUpdate){
              this.setCentralZoom(zoom)
            }
            return this
          }


          setCentralZoom(zoom){
           // console.log(zoom)
            let r = 1;
            switch (true){
              case 6<zoom:
                r = 2;
                break;
              case 5<zoom:
                r = 3;
                break;
              case 4<zoom:
                r = 4;
                break;
              default:
                r = 5
            }

            this.centralFaceList.forEach(face=>{
              face.setMaterialIndex(this._defaultMaterialIndex)
            })


            this.centralFaceList.length = 0;
            for(let colIndex = this.centralFace.colIndex-r; colIndex<=this.centralFace.colIndex+r; colIndex++){

              for(let rowIndex  = this.centralFace.rowIndex-r; rowIndex<this.centralFace.rowIndex+r; rowIndex++){
                let _colIndex = this.normalizeTabIndex(colIndex)
                let _rowIndex = this.normalizeTabIndex(rowIndex)
                if(this.earthFacesHash[_colIndex] && this.earthFacesHash[_colIndex][_rowIndex]){
                  this.earthFacesHash[_colIndex][_rowIndex].setMaterialIndex(0)
                  this.centralFaceList.push(this.earthFacesHash[_colIndex][_rowIndex])
                }
              }
            }
           const lngList = [].concat(...this.centralFaceList.map(face => [].concat(face.lngMin, face.lngMax)));
           const latList = [].concat(...this.centralFaceList.map(face => [].concat(face.latMin, face.latMax)));

           const lngMin = Math.min(...lngList);
           const lngMax = Math.max(...lngList);

           const latMin = Math.min(...latList);
           const latMax = Math.max(...latList);

           this.getTiles({lngMin, lngMax, latMin, latMax}, zoom)
          }


          /**
           *
           * @param {number}lngMin
           * @param {number}lngMax
           * @param {number}latMin
           * @param {number}latMax
           * @param {number}zoom
           */
          getTiles({lngMin, lngMax, latMin, latMax}, zoom){
            const tilesLengthPx = Math.pow(2, zoom)*256;
            const xMin = this.getX(lngMin, zoom);
            const xMax = this.getX(lngMax, zoom);
            const yMax = this.getY(latMin, zoom)
            const yMin = this.getY(latMax, zoom)


            const fromNx = Math.floor(xMin/256);
            const toNx = Math.ceil(xMax/256);

            const fromNy = Math.floor(yMin/256);
            const toNy = Math.ceil(yMax/256);

            console.log(fromNy, toNy)

            getTileLimit(fromNx, toNx, fromNy, toNy, zoom)
              .then(d=>{
                console.log(d)
              })



          }






          normalizeTabIndex(index){
            let upIndex = 0;
            if(0<=index && index<this.segments){
              upIndex = index
            } else if(index<0) {
              upIndex = this.segments + index
            }else{
              upIndex = index - this.segments
            }
            return upIndex
          }

          getX(lng, zoom) {
            return (Math.radians(lng)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
          }
          getY(lat, zoom) {
            return (Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(lat/2) )  ))* Math.pow(2, zoom)*128/Math.PI
          }

        };

        //THREE.EarthGeometry = EarthGeometry;

        Object.assign(THREE, {EarthGeometry})
        return three
      })
  }

  return Promise.resolve(THREE)

}
