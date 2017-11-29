/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';
import './earth-component.styl'
import {autobind} from "core-decorators";
import {$Worker} from '../../util/worker'
import {getImageWorker} from  '../../util/load-image-blob'

import defineload from '../../util/defineload'

function evalInContext(js, context) {
  return function () {
    return eval(js);
  }.call(context);
}

let THREE = undefined;





const cloudsMaterialLoader = (z, x, y) =>{
  debugger
  const sphereMaterial = new THREE.MeshPhongMaterial({
    needsUpdate: true,
    specular: "#ffffff",
    color: 0xffffff,
    shininess: 1,
    transparent: true,
    opacity: 1.2,
    reflectivity: 10,


   // flatShading: true,
    bumpScale: 0.1
  });

  sphereMaterial.promise = new Promise((res, rej)=>{
    const textureLoader = new THREE.TextureLoader();
    //textureLoader.load(`https://d.maps.owm.io/map/clouds_new/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1`, (texture) =>{
    //textureLoader.load(`https://g.maps.owm.io/map/temp_new/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1`, (texture) =>{
    textureLoader.load(`https://f.maps.owm.io/map/precipitation_new/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1`, (texture) =>{
      //sphereMaterial.alphaMap = texture;
      sphereMaterial.map = texture;
      sphereMaterial.emissiveMap = texture;
      sphereMaterial.emissiveIntensity = 5;
      sphereMaterial.needsUpdate = true;
      res(sphereMaterial)
    })
  })
  return sphereMaterial
};

const groundMaterialLoader = (z, x, y) =>{
  const sphereMaterial = new THREE.MeshPhongMaterial({
    needsUpdate: true,
    specular: "#ffffff",
    shininess: 1,
    //flatShading: true,
    //wireframe: true,
    bumpScale: 0.1
  });
  sphereMaterial.needsUpdate = true;






  sphereMaterial.promise = new Promise((res, rej)=>{
   /* getImageWorker(`https://maps.tilehosting.com/data/satellite/${z}/${x}/${y}.jpg?key=SoGrAH8cEUtj6OnMI1UY`)
      .then(img=>{
        const texture = new THREE.Texture(img)
        sphereMaterial.map = texture;
        sphereMaterial.emissiveMap = texture
        sphereMaterial.needsUpdate = true;
        texture.needsUpdate = true;
        res(sphereMaterial)
      })*/


   const canvas = document.createElement('canvas')

    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "green";
    ctx.fillRect(125/2, 125/2, 125, 125);
    ctx.strokeStyle="blue";
    ctx.rect(0,0,256,256);
    ctx.fillStyle = "red";
    ctx.stroke();
    ctx.font = "20px Arial";
    ctx.fillText(`x=${x}; y=${y}`,65, 110);

    let lng = x * 360/Math.pow(2, z);
    let lat = 90 - (y+2)*180/(Math.pow(2, z)+2)
    if(180<lng){
      lng = lng - 360
    }
    ctx.fillText(`lng=${lng};`,10,220);
    ctx.fillText(`lat=${lat};`,10,240);

    const zoom = 4;

    const xPx = (Math.radians(lng)+Math.PI)* Math.pow(2, zoom)*128/Math.PI;
    const yPx = (Math.PI - Math.log( Math.tan( Math.PI/4 + Math.radians(lat/2) )  ))* Math.pow(2, zoom)*128/Math.PI


    ctx.fillText(`X =${xPx}px;`,10,160);
    ctx.fillText(`Y =${yPx}px;`,10,180);

    let xN = parseInt(xPx/256)
    let yN = parseInt(yPx/256)

    if(Math.pow(2, zoom)<=xN){
      xN = 0
    }

    if(Math.pow(2, zoom)<=yN){
      yN=0
    }

    getImageWorker(`https://maps.tilehosting.com/data/satellite/${zoom}/${xN}/${yN}.jpg?key=SoGrAH8cEUtj6OnMI1UY`)
      .then(img=>{
        const x = (xPx/256) - parseInt(xPx/256);
        const y = -(yPx/256)+  parseInt(yPx/256);

        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 256
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img,x,y);



        const imgC = new Image();
        imgC.onload = function () {
          (window.URL || window.webkitURL).revokeObjectURL(imgC.src);
          const texture = new THREE.Texture(imgC)
          sphereMaterial.map = texture;
          sphereMaterial.emissiveMap = texture
          sphereMaterial.needsUpdate = true;
          texture.needsUpdate = true;
          res(sphereMaterial)

        };
        imgC.src = canvas.toDataURL("image/png")






        /*const texture = new THREE.Texture(img)
        sphereMaterial.map = texture;
        sphereMaterial.emissiveMap = texture
        sphereMaterial.needsUpdate = true;
        texture.needsUpdate = true;
        res(sphereMaterial)*/
      })
      .catch(err=>{
        console.log(err)
      })


    /*const img = new Image();
    img.onload = function () {
      (window.URL || window.webkitURL).revokeObjectURL(img.src);
      const texture = new THREE.Texture(img)
      sphereMaterial.map = texture;
      sphereMaterial.emissiveMap = texture
      sphereMaterial.needsUpdate = true;
      texture.needsUpdate = true;
      res(sphereMaterial)

    };
    img.src = canvas.toDataURL("image/png")*/

   /* getImageWorker('https://maps.tilehosting.com/data/satellite/0/0/0.jpg?key=SoGrAH8cEUtj6OnMI1UY')
      .then(img=>{
        console.log(img)
      })*/




    /*const textureLoader = new THREE.TextureLoader();
   // textureLoader.load(`http://c.tile.openstreetmap.org/${z}/${x}/${y}.png`, (texture) =>{
    textureLoader.load(`https://maps.tilehosting.com/data/satellite/${z}/${x}/${y}.jpg?key=SoGrAH8cEUtj6OnMI1UY"`, (texture) =>{
    //textureLoader.load(`https://maps.tilehosting.com/data/satellite/${z}/${x}/${y}.jpg?key=SoGrAH8cEUtj6OnMI1UY"`, (texture) =>{
      sphereMaterial.map = texture;
      sphereMaterial.emissiveMap = texture
      sphereMaterial.needsUpdate = true;
      res(sphereMaterial)
    })*/
  })
  return sphereMaterial
};


const facesIndexed = (geometry, facesCount) =>{
  let k = 1;
  for(let i = 0 ; i<geometry.faces.length; i++ ){
    if(facesCount-1<i && i<geometry.faces.length-facesCount){
      geometry.faces[i].materialIndex = k
      if(i%2){
        k++
      }
    }
  }

  const faceVertexUvs = geometry.faceVertexUvs[0]
  for (let i = 0; i< geometry.faces.length; i+=2){
    if(facesCount-1<i && i<geometry.faces.length-facesCount){
      faceVertexUvs[i] = [
        new THREE.Vector2(1, 1),
        new THREE.Vector2(0, 1),
        new THREE.Vector2(1, 0)];

      faceVertexUvs[i+1] = [
        new THREE.Vector2(0, 1),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
      ];
    }
  }
}



class EarthView{
  constructor(){
    this.$$el = null;
    this.$$rx = 0;
    this.$$ry = 0;
    this.$$ay = 0; this.tempAy = 0;
    this.$$ax = 0; this.tempAx = 0;
    this.$$cameraDist  = 40;

    this.rotationMeshList = [];

    this.isDestroyed = false
  }

  /**
   * @param {Element} el
   */
  init(el){




    this.isDestroyed = false
    this.$$el = el;
    const scene =this.scene =  new THREE.Scene();

    const camera = this.camera =  new THREE.PerspectiveCamera(12, el.clientWidth / el.clientHeight, 0.1, 1000);
    const renderer = this.renderer =  new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor('#000');
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const light	= new THREE.SpotLight( 0x888888, 1.2 )
    light.position.set( 2, 2, 40 );
    const light2	= new THREE.SpotLight( 0x888888,0.2 )
    light2.position.set( -20, -10, 10 );
    scene.add( light );
    scene.add( light2 );


    const zoom = 5;

    const faces =  Math.pow(2, zoom)

    const sphereGeometry = new THREE.SphereGeometry(4, faces, faces+2);
    const cloudsGeometry = new THREE.SphereGeometry(4.1, faces, faces);
    const holeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});


    facesIndexed(sphereGeometry, faces)
    facesIndexed(cloudsGeometry, faces)


    console.log(faces)
    const groundMaterials = ((z)=>{
      const arr = [];
      const max = Math.pow(2, z);
      for(let y = 0; y<max; y++){
        for(let x=0; x<max; x++){
          arr.push(groundMaterialLoader(z, x, y))
        }
      }
      return arr
    })(zoom);




    /*const cloudsMaterials = ((z)=>{
      const arr = [];
      const max = Math.pow(2, z);
      for(let y = 0; y<max; y++){
        for(let x=0; x<max; x++){
          arr.push(cloudsMaterialLoader(z, x, y))
        }
      }
      return arr
    })(zoom);*/





    const materials = []
    materials.push(holeMaterial)

    groundMaterials.unshift(holeMaterial);
    groundMaterials.push(holeMaterial);

   // cloudsMaterials.unshift(holeMaterial)
   // cloudsMaterials.push(holeMaterial)

    const halfIndex = sphereGeometry.faces.length/2 - (faces*2)
    sphereGeometry.faces[halfIndex].materialIndex =  0
    sphereGeometry.faces[halfIndex+1].materialIndex =  0


    console.log(sphereGeometry.faces[halfIndex])

    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, groundMaterials);
    //const cloudsMesh = this.cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterials);

    //this.rotationMeshList.push(rEarthMesh, cloudsMesh);
    this.rotationMeshList.push(rEarthMesh);


    rEarthMesh.position.x = 0;
    rEarthMesh.position.y = 0;
    rEarthMesh.position.z = 0;


    scene.add(rEarthMesh)
   // scene.add(cloudsMesh)
    scene.add(light)
    camera.lookAt(rEarthMesh.position);
    camera.position.z = this.$$cameraDist;

    const anima = () => {
      renderer.render(scene, camera);
      if(!this.isDestroyed)
        requestAnimationFrame(anima);
    }
    anima()
    //this.render()
    this.bindEvents();
    return this;
  }
  @autobind
  render(){
    requestAnimationFrame(()=>{
      this.renderer.render(this.scene, this.camera);
    })


  }

  @autobind
  mousmove(e){



    const dx = this.tx ? e.clientX - this.tx : 0
    const dy = this.ty ? e.clientY - this.ty : 0
    const k = this.camera.position.z - 4;

    this.rotationMeshList.forEach(mesh=>{
      mesh.rotation.y+=(dx*.001)
      mesh.rotation.x+=(dy*.001)
    });

    this.tx = e.clientX
    this.ty = e.clientY

    /*const dx = this.$$rx - e.clientX ;
    const dy =  e.clientY - this.$$ry;
    this.$$ax = this.tempAx + dy;
    this.$$ay = this.tempAy + dx;
    const ayRad = Math.radians(this.$$ay)
    const axRad = Math.radians(this.$$ax)

    this.camera.position.x = this.$$cameraDist*Math.sin(ayRad)
    this.camera.position.z = this.$$cameraDist*Math.cos(ayRad);
    this.camera.position.y = this.$$cameraDist*Math.sin(axRad)

    this.camera.position.z = this.$$cameraDist*Math.cos(axRad) -(this.$$cameraDist - this.camera.position.z);
    this.camera.lookAt(this.rEarthMesh.position);
    console.log(axRad)*/
    this.render()

  }

  @autobind
  mousedown(e){
    this.tx = 0
    this.ty = 0
    this.$$el.removeEventListener('mousemove', this.mousmove);
    this.$$el.addEventListener('mousemove', this.mousmove)
  }
  @autobind
  mouseup(e){
    this.$$el.removeEventListener('mousemove', this.mousmove)
  }

  @autobind
  onweel(e){

    //console.log(this.$$cameraDist - this.camera.position.z+1)

    let dy = (e.deltaY*0.005);
    const k = this.camera.position.z - 4;
    this.camera.position.z = this.camera.position.z+(dy*k)

    //this.camera.fov +=dy
    //this.camera.updateProjectionMatrix()


    //this.render()
  }

  bindEvents(){
      this.$$el.addEventListener('mousedown', this.mousedown)
      this.$$el.addEventListener('mouseup', this.mouseup)
      this.$$el.addEventListener("wheel", this.onweel);

  }

  unbindEvents(){
    this.$$el.removeEventListener('mousedown', this.mousedown)
    this.$$el.removeEventListener('mouseup', this.mouseup)
    this.$$el.removeEventListener('mousemove', this.mousmove)
    this.$$el.removeEventListener("wheel", this.onweel);
  }

  destroy(){
    this.unbindEvents()
    this.isDestroyed = true
  }
}

const earthView = new EarthView()



/*
*/



export const EarthComponent = Vue.component('android-component', {
  template: template(),
  data: function () {
    return {}
  },
  mounted: function(e) {
      defineload('THREE')
        .then(t=>{
          THREE = t
          earthView.init(this.$el)
        });
  },
  beforeDestroy: function() {
    console.log(this.$el)
    earthView.destroy()
  }

});
