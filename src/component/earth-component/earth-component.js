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

    const light	= new THREE.SpotLight( 0x888888 )
    light.position.set( 10, 10, 10 );
    scene.add( light )

    const sphereGeometry = new THREE.SphereGeometry(4, 32, 16);


    //const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} )
    const sphereMaterial = new THREE.MeshPhongMaterial({
      //map: THREE.ImageUtils.loadTexture('img/three/osm.png', {}, render),
      //map: THREE.ImageUtils.loadTexture('img/three/earth.png', {}, render),
      // map: textureLoader.load('img/three/earth.png', render),
      //bumpMap: textureLoader.load('img/three/earth_bump.png', render),
      needsUpdate: true,
      //specularMap: textureLoader.load('img/three/earth-specular.jpg', render),
      //emissiveMap: textureLoader.load('img/three/earth_night.jpg',  render),
      // emissive : "#aaa",
      flatShading: true,
      specular: "#ffffff",
      dynamic: true,
      shininess: 50,
      bumpScale: 0.1
    });

    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
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

  bindEvents(){
      this.$$el.addEventListener('mousedown', this.mousedown)
      this.$$el.addEventListener('mouseup', this.mouseup)
  }

  unbindEvents(){
    this.$$el.removeEventListener('mousedown', this.mousedown)
    this.$$el.removeEventListener('mouseup', this.mouseup)
    this.$$el.removeEventListener('mousemove', this.mousmove)
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
