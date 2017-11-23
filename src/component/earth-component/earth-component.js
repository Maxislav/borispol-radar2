/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';
import './earth-component.styl'
import {autobind} from "core-decorators";

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
    opacity: 0.6,
    //flatShading: true,
    bumpScale: 0.1
  });

  sphereMaterial.promise = new Promise((res, rej)=>{
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(`https://d.maps.owm.io/map/clouds_new/${z}/${x}/${y}?appid=b1b15e88fa797225412429c1c50c122a1`, (texture) =>{
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
    bumpScale: 0.1
  });

  sphereMaterial.promise = new Promise((res, rej)=>{
    const textureLoader = new THREE.TextureLoader();
    //textureLoader.load(`http://c.tile.openstreetmap.org/${z}/${x}/${y}.png`, (texture) =>{
    textureLoader.load(`https://maps.tilehosting.com/data/satellite/${z}/${x}/${y}.jpg?key=SoGrAH8cEUtj6OnMI1UY"`, (texture) =>{
      sphereMaterial.map = texture;
      sphereMaterial.needsUpdate = true;
      res(sphereMaterial)
    })
  })
  return sphereMaterial
};



class EarthView{
  constructor(){
    this.$$el = null;
    this.$$rx = 0;
    this.$$ry = 0;
    this.$$ay = 0; this.tempAy = 0;
    this.$$ax = 0; this.tempAx = 0;
    this.$$cameraDist  = 50;
    this.isDestroyed = false
  }

  /**
   * @param {Element} el
   */
  init(el){
    this.isDestroyed = false
    this.$$el = el;
    const scene = new THREE.Scene();
    const camera = this.camera =  new THREE.PerspectiveCamera(12, el.clientWidth / el.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true});
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

    const sphereGeometry = new THREE.SphereGeometry(4, faces, faces);



    const textureLoader = new THREE.TextureLoader()

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

    const cloudsMaterials = ((z)=>{
      const arr = [];
      const max = Math.pow(2, z);
      for(let y = 0; y<max; y++){
        for(let x=0; x<max; x++){
          arr.push(cloudsMaterialLoader(z, x, y))
        }
      }
      return arr
    })(zoom);


    console.log(groundMaterials)

    const faceVertexUvs = sphereGeometry.faceVertexUvs[0]
    for (let i = 0; i< sphereGeometry.faces.length; i+=2){
      faceVertexUvs[i] = [
        new THREE.Vector2(1, 1),
        new THREE.Vector2(0, 1),
        new THREE.Vector2(1, 0)];

      faceVertexUvs[i+1] = [
        new THREE.Vector2(0, 1),
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
      ];
      /*if(i<4){
        sphereGeometry.faces[i].materialIndex = i
      }*/
    }
   /* sphereGeometry.faces[0].materialIndex = 0
    sphereGeometry.faces[1].materialIndex = 1
    sphereGeometry.faces[2].materialIndex = 2
    sphereGeometry.faces[3].materialIndex = 3*/

    let k = faces
    for(let i = faces; i<sphereGeometry.faces.length; i+=2){
      sphereGeometry.faces[i+1].materialIndex = k;
      sphereGeometry.faces[i].materialIndex = k;
      k++
    }





    console.log(sphereGeometry.faces)
    //console.log(THREE.SceneUtils.createMultiMaterialObject(sphereGeometry, [sphereMaterial, sphereMaterial2]))
    /*for(var i = 0; i <  sphereGeometry.faces.length; i++) {
        sphereGeometry.faces[i].materialIndex = i
      //sphereGeometry.faces[i].materialIndex = i

    }*/

    const cloudsGeometry = sphereGeometry.clone()

    console.log(cloudsGeometry)


    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, groundMaterials);
    const cloudsMesh = this.cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterials);
    cloudsMesh.radius = 5

    rEarthMesh.position.x = 0;
    rEarthMesh.position.y = 0;
    rEarthMesh.position.z = 0;



    scene.add(rEarthMesh)
    scene.add(cloudsMesh)
    scene.add(light)
    camera.lookAt(rEarthMesh.position);
    camera.position.z = this.$$cameraDist;

    const anima = () => {
      renderer.render(scene, camera);
      if(!this.isDestroyed)
        requestAnimationFrame(anima);
    }
    anima()
    this.bindEvents();
    return this;
  }

  @autobind
  mousmove(e){



    const dx = this.tx ? e.clientX - this.tx : 0
    const dy = this.ty ? e.clientY - this.ty : 0

    //let dy = (e.deltaY*0.001);
    const k = this.camera.position.z - 4;


    this.rEarthMesh.rotation.y+=(dx*.0002*k)
    this.rEarthMesh.rotation.x+=(dy*.0002*k)

    this.cloudsMesh.rotation.y+=(dx*.0002*k)
    this.cloudsMesh.rotation.x+=(dy*.0002*k)

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

    let dy = (e.deltaY*0.002);
    const k = this.camera.position.z - 4;
    this.camera.position.z = this.camera.position.z+(dy*k)


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








export const EarthComponent = Vue.component('android-component', {
  template: template(),
  data: function () {
    return {}
  },
  mounted: function(e) {
    console.log(this.$el)
    if(!THREE){
      this.$http.get('./lib/three.js')
        .then(d=>{
          const reader = new FileReader();
          reader.onload = () => {
            //console.log(reader.result);
            const text = reader.result;
            const module = {}
            evalInContext(`(function(global) {let module; ` +text+ `;}).call(this)`, module)
            THREE = module.THREE;
            earthView.init(this.$el)
          };
          reader.readAsText(d.data);
        })
    }else {
      earthView.init(this.$el)
    }

  },
  beforeDestroy: function() {
    console.log(this.$el)
    earthView.destroy()
  }

});
