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

function rotate(pitch, roll, yaw) {
  var cosa = Math.cos(yaw);
  var sina = Math.sin(yaw);

  var cosb = Math.cos(pitch);
  var sinb = Math.sin(pitch);

  var cosc = Math.cos(roll);
  var sinc = Math.sin(roll);

  var Axx = cosa*cosb;
  var Axy = cosa*sinb*sinc - sina*cosc;
  var Axz = cosa*sinb*cosc + sina*sinc;

  var Ayx = sina*cosb;
  var Ayy = sina*sinb*sinc + cosa*cosc;
  var Ayz = sina*sinb*cosc - cosa*sinc;

  var Azx = -sinb;
  var Azy = cosb*sinc;
  var Azz = cosb*cosc;

  const points = [this]

  for (var i = 0; i < points.length; i++) {
    var px = points[i].x;
    var py = points[i].y;
    var pz = points[i].z;

    points[i].x = Axx*px + Axy*py + Axz*pz;
    points[i].y = Ayx*px + Ayy*py + Ayz*pz;
    points[i].z = Azx*px + Azy*py + Azz*pz;
  }
  return points
}



const materialLoader = (z, x, y) =>{

  const sphereMaterial = new THREE.MeshPhongMaterial({
    needsUpdate: true,
    specular: "#ffffff",
    shininess: 1,
    //flatShading: true,
    bumpScale: 0.1
  });

  sphereMaterial.promise = new Promise((res, rej)=>{
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(`http://c.tile.openstreetmap.org/${z}/${x}/${y}.png`, (texture) =>{
      sphereMaterial.map = texture
      sphereMaterial.needsUpdate = true
      res(sphereMaterial)
    })
  })

  return sphereMaterial


}



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


    //const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} )

    const sphereMaterial = materialLoader(0 , 0,  0);

    const materials = ((z)=>{
      const arr = [];
      const max = Math.pow(2, z);
      for(let y = 0; y<max; y++){
        for(let x=0; x<max; x++){
          arr.push(materialLoader(z, x, y))
        }
      }
      return arr
    })(zoom);



    /*Promise.all(
      materials.map(it=>materialLoader(...it).promise)
    ).then(m=>{
      console.log(m)
    })*/
    console.log(materials)

    const sphereMaterial2 = new THREE.MeshPhongMaterial({
      // map: THREE.TextureLoader('src/img/sq.png', {}),
      //map: THREE.ImageUtils.loadTexture('img/three/earth.png', {}, render),
      // map: textureLoader.load('img/three/earth.png', render),
      //bumpMap: textureLoader.load('img/three/earth_bump.png', render),
      needsUpdate: true,
      //specularMap: textureLoader.load('img/three/earth-specular.jpg', render),
      //emissiveMap: textureLoader.load('img/three/earth_night.jpg',  render),
      // emissive : "#aaa",
      //morphNormals: true,
      //flatShading: true,
      specular: "#ffffff",
      shininess: 50,
      bumpScale: 0.1
    });

    textureLoader.load('src/img/sq.png',
    function(texture1) {
      sphereMaterial2.map = texture1
      sphereMaterial2.needsUpdate = true
      textureLoader.load( 'http://c.tile.openstreetmap.org/0/0/0.png',
        function ( texture ) {
          sphereMaterial.map = texture
          sphereMaterial.needsUpdate = true
        }
      )
    })

    const faceVertexUvs = sphereGeometry.faceVertexUvs[0]

/*
    faceVertexUvs[4] = [
      new THREE.Vector2(1, 1),
      new THREE.Vector2(0, 1),
      new THREE.Vector2(1, 0)];

    faceVertexUvs[5] = [
      new THREE.Vector2(0, 1),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
    ];*/

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

/*

    sphereGeometry.faces[4].materialIndex = 4
    sphereGeometry.faces[5].materialIndex = 4
    sphereGeometry.faces[6].materialIndex = 5
    sphereGeometry.faces[7].materialIndex = 5
*/



console.log(sphereGeometry.faces)
    //console.log(THREE.SceneUtils.createMultiMaterialObject(sphereGeometry, [sphereMaterial, sphereMaterial2]))
    /*for(var i = 0; i <  sphereGeometry.faces.length; i++) {
        sphereGeometry.faces[i].materialIndex = i
      //sphereGeometry.faces[i].materialIndex = i

    }*/

    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, materials);

    rEarthMesh.position.x = 0;
    rEarthMesh.position.y = 0;
    rEarthMesh.position.z = 0;



    scene.add(rEarthMesh)
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
    this.rEarthMesh.rotation.y+=(dx*.005)
    this.rEarthMesh.rotation.x+=(dy*.005)

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
    this.camera.position.z = this.camera.position.z+=(e.deltaY*.1)
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
