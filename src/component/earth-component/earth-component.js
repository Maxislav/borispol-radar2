/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';
import './earth-component.styl'

function evalInContext(js, context) {
  return function () {
    return eval(js);
  }.call(context);
}

let THREE = undefined;

/**
 *
 * @param {Element} el
 */
const init = (el) =>{
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(12, el.clientWidth / el.clientHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor('#000');
  renderer.setSize(el.clientWidth, el.clientHeight);
  el.appendChild(renderer.domElement);

  var light	= new THREE.SpotLight( 0x888888 )
  light.position.set( 10, 10, 10 );
  scene.add( light )

  var sphereGeometry = new THREE.SphereGeometry(4, 32, 16);


  //var sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} )
  var sphereMaterial = new THREE.MeshPhongMaterial({
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

  var rEarthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rEarthMesh.position.x = 0;
  rEarthMesh.position.y = 0;
  rEarthMesh.position.z = 0;

  scene.add(rEarthMesh)
  scene.add(light)

  camera.lookAt(rEarthMesh.position);
  camera.position.z = 50

  setTimeout(()=>{
    renderer.render(scene, camera);
  }, 200)




}






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
            init(this.$el)
          };
          reader.readAsText(d.data);
        })
    }else {
      init(this.$el)
    }

  },



});
