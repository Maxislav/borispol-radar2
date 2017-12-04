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
          constructor(face1, face2, faceUvs1, faceUvs2, index){
            this.face1 = face1;
            this.face2 = face2;
            this.faceUvs1 = faceUvs1;
            this.faceUvs2 = faceUvs2;
            this.index = index;

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

            //console.log(index)
          }

          setMaterialIndex(i){
            this.face1.materialIndex = i;
            this.face2.materialIndex = i;
            return this;
          }
        }


        THREE.EarthGeometry = class extends THREE.SphereGeometry{
          constructor(radius, segments){
            super(radius, segments, segments+2);
            this.segments = segments;
            this.earhFaces = [];
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
                const  earthFace = new EarthFace(this.faces[i], this.faces[i+1], faceVertexUvs[i], faceVertexUvs[i+1], k);
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

              earthFace.latMin = 90 - (earthFace.rowIndex+1)*dLat;
              earthFace.latMax = 90 - (earthFace.rowIndex+2)*dLat;
              console.log(earthFace.lngMin, earthFace.lngMax);
              if(earthFace.rowIndex == 0){
                earthFace.setMaterialIndex(2)
              }else {
                earthFace.setMaterialIndex(1)
              }
            })
          }



          faceIndex(){


          }
        };
        return three
      })
  }

  return Promise.resolve(THREE)

}
