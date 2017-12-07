/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';
import './earth-component.styl'
import {autobind} from "core-decorators";
import {$Worker} from '../../util/worker'
import {getImageWorker, Canvas} from  '../../util/load-image-blob'

import {init as mySphearInit} from  './my-sphear'

console.log(mySphearInit)

import defineload from '../../util/defineload'
import {getTile, getTiledImage} from "./eart-tile";

function evalInContext(js, context) {
  return function () {
    return eval(js);
  }.call(context);
}

let THREE = undefined;





const cloudsMaterialLoader = (z, x, y) =>{
  const sphereMaterial = new THREE.MeshPhongMaterial({
    needsUpdate: true,
    specular: "#ffffff",
    color: 0xffffff,
    shininess: 1,
    transparent: true,
    opacity: 1,
    reflectivity: 10,


   // flatShading: true,
    bumpScale: 0.1
  });

  sphereMaterial.promise = new Promise((res, rej)=>{

    let lngMin = x * 360/Math.pow(2, z);
    let lngMax = (x+1) * 360/Math.pow(2, z);
    let latMin = 90 - (y+2)*180/(Math.pow(2, z)+2);
    let latMax = 90 - (y+2-1)*180/(Math.pow(2, z)+2);

    if(180<lngMin){
      lngMin = lngMin - 360
    }

    if(180 < lngMax){
      lngMax = lngMax - 360
    }

    //if(0<=latMin && latMin<45 && 90<=lngMin && lngMin<=180)
    getTile({
      lngMin,
      lngMax,
      latMin,
      latMax,
      x,
      y,
      type: 'clouds'
    }).then(img=>{
      const texture = new THREE.Texture(img)
      sphereMaterial.map = texture;
      sphereMaterial.emissiveMap = texture
      sphereMaterial.needsUpdate = true;
      texture.needsUpdate = true;
      res(sphereMaterial)
    });
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

    let lngMin = x * 360/Math.pow(2, z);
    let lngMax = (x+1) * 360/Math.pow(2, z);
    let latMin = 90 - (y+2)*180/(Math.pow(2, z)+2);
    let latMax = 90 - (y+2-1)*180/(Math.pow(2, z)+2);

    if(180<lngMin){
      lngMin = lngMin - 360
    }

    if(180 < lngMax){
      lngMax = lngMax - 360
    }

    //if(0<=latMin && latMin<45 && 90<=lngMin && lngMin<=180)
    getTile({
      lngMin,
      lngMax,
      latMin,
      latMax,
      x,
      y,
      type: 'ground'
    }).then(img=>{
      const texture = new THREE.Texture(img)
      sphereMaterial.map = texture;
      sphereMaterial.emissiveMap = texture
      sphereMaterial.needsUpdate = true;
      texture.needsUpdate = true;
      res(sphereMaterial)
    });






   /* const img = new Image();
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
    light.position.set( -20, 10, 40 );
    const light2	= new THREE.SpotLight( 0x888888,0.5 )
    light2.position.set( 2, 2, -20 );
    scene.add( light );
    scene.add( light2 );


    const zoom = 6;

    const faces =  Math.pow(2, zoom)

    const sphereGeometry = new THREE.EarthGeometry(4, faces);
    const cloudsGeometry = new THREE.EarthGeometry(4.1, faces);
    const holeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const groundMaterial = new THREE.MeshPhongMaterial();
    const cloudsMaterial = new THREE.MeshPhongMaterial({transparent: true,opacity: 1});



    const glowMaterial = new THREE.ShaderMaterial(
      {
        uniforms:
          {
            "c":   { type: "f", value: 1.0 },
            "p":   { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xccddff) },
            viewVector: { type: "v3", value: camera.position }
          },
        vertexShader:   `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() 
        {
            vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }

        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() 
          {
            vec3 glow = glowColor * intensity;
              gl_FragColor = vec4( glow, 1.0 );
          }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      } );











    const testMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, flatShading: true});


    getTiledImage({type:'ground'})
      .then(img=>{
        const texture = new THREE.Texture(img);
        groundMaterial.map = texture;
        groundMaterial.emissiveMap = texture;
        groundMaterial.needsUpdate = true;
        texture.needsUpdate = true;
      })
    getTiledImage({type:'rain'}, () =>{

    })
      .then(img=>{
        const texture = new THREE.Texture(img);
        cloudsMaterial.map = texture;
        cloudsMaterial.emissiveMap = texture;
        cloudsMaterial.needsUpdate = true;
        texture.needsUpdate = true;
      })


   /* getImageWorker('../src/img/z0.jpg')
      .then(img=>{
        const texture = new THREE.Texture(img);
        groundMaterial.map = texture;
        groundMaterial.emissiveMap = texture;
        groundMaterial.needsUpdate = true;
        texture.needsUpdate = true;
      });*/


    //facesIndexed(sphereGeometry, faces)
    //facesIndexed(cloudsGeometry, faces)


   // console.log(faces)
   /* const groundMaterials = ((z)=>{
      const arr = [];
      const max = Math.pow(2, z);
      for(let y = 0; y<max; y++){
        for(let x=0; x<max; x++){
          arr.push(groundMaterialLoader(z, x, y))
        }
      }
      return arr
    })(zoom);
*/



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

    //groundMaterials.unshift(holeMaterial);
    //groundMaterials.push(holeMaterial);

    //cloudsMaterials.unshift(holeMaterial)
    //cloudsMaterials.push(holeMaterial)

   /* const halfIndex = sphereGeometry.faces.length/2 - (faces*2)
    sphereGeometry.faces[halfIndex].materialIndex =  0
    sphereGeometry.faces[halfIndex+1].materialIndex =  0*/


    //console.log(sphereGeometry.faces[halfIndex])

    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, [holeMaterial, groundMaterial]);
    const cloudsMesh = this.cloudsMesh = new THREE.Mesh(cloudsGeometry,  [holeMaterial, cloudsMaterial]);
    const glowMesh =  new THREE.Mesh( cloudsGeometry.clone(), glowMaterial )
    glowMesh.scale.multiplyScalar(1.01);
    //glowMesh.add(sprite)


    getImageWorker('../img/glow.png')
      .then(img=>{
        const spriteMaterial = new THREE.SpriteMaterial(
          {
            map: new THREE.Texture(img, {needsUpdate: true}),
            lights: true,
            useScreenCoordinates: false, alignment: sphereGeometry.center,
            color: 0xccddff, transparent: false, blending: THREE.AdditiveBlending
          })
        spriteMaterial.needsUpdate = true
        spriteMaterial.map.needsUpdate = true
        const sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(10, 10, 1.0);

        glowMesh.add(sprite)
      })


    this.rotationMeshList.push(rEarthMesh, cloudsMesh);
    //this.rotationMeshList.push(rEarthMesh);


    rEarthMesh.position.x = 0;
    rEarthMesh.position.y = 0;
    rEarthMesh.position.z = 0;


    scene.add(rEarthMesh)
    scene.add(cloudsMesh)
    scene.add(glowMesh)

    scene.add(light)
    camera.lookAt(rEarthMesh.position);
    camera.position.z = this.$$cameraDist;

    //loadIm



    // var skyMaterial = new THREE.ShaderMaterial( {
    //   fragmentShader: shader.fragmentShader,
    //   vertexShader: shader.vertexShader,
    //   uniforms: shader.uniforms,
    //   depthWrite: false,
    //   side: THREE.BackSide
    // } );



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

  changeCameraPosition(){
    const ayRad = Math.radians(this.$$ay)
    const axRad = Math.radians(this.$$ax)
    const z1 = this.$$cameraDist*Math.cos(ayRad)
    const y1 = this.$$cameraDist*Math.sin(ayRad)
    const dx2 = z1 * Math.sin(axRad);
    const dz2 = z1 * Math.cos(axRad);
    this.camera.position.y = y1
    this.camera.position.x = dx2
    this.camera.position.z = dz2
    this.camera.lookAt(this.rEarthMesh.position);
  }

  @autobind
  mousmove(e){
    const dx = this.tx - e.clientX;
    const dy = e.clientY - this.ty;
    this.$$ax = this.tempAx + dx*0.1;
    this.$$ay = this.tempAy + dy*0.1;
    this.changeCameraPosition()
  }

  @autobind
  mousedown(e){
    this.tx = e.clientX
    this.ty = e.clientY

    this.tempAy = this.$$ay
    this.tempAx = this.$$ax
    console.log('mousedown',  this.tempAy)
    this.$$el.removeEventListener('mousemove', this.mousmove);
    this.$$el.addEventListener('mousemove', this.mousmove)
  }
  @autobind
  mouseup(e){
    this.$$el.removeEventListener('mousemove', this.mousmove)
  }

  @autobind
  onweel(e){
    let dy = (e.deltaY*0.005);
    const k = this.$$cameraDist - 4;
    this.$$cameraDist = this.$$cameraDist+(dy*k)
    this.changeCameraPosition()
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
          THREE = t;
          return mySphearInit()
        })
        .then(()=>{
          earthView.init(this.$el)
        });
  },
  beforeDestroy: function() {
    console.log(this.$el)
    earthView.destroy()
  }

});
