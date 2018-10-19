/**
 * Created by maxislav on 15.11.17.
 */
import Vue from 'vue';
import template from './earth-component.pug';
import './earth-component.styl'
import {autobind} from "core-decorators";
import {$Worker} from '../../util/worker'
import {getImageWorker, Canvas} from  '../../util/load-image-blob'
import $ from 'jquery-lite';

import {init as mySphereInit} from  './my-sphear'
import defineload from '../../util/defineload'
import {getTiledImage} from "./eart-tile";

function evalInContext(js, context) {
  return function () {
    return eval(js);
  }.call(context);
}

let THREE = undefined;
/**
 * {EarthView}
 */
let earthView;


class EarthView{
  constructor($data){
    this.$data = $data;
    this.$$el = null;
    this.$$rx = 0;
    this.$$ry = 0;
    this.$$ay = 0; this.tempAy = 0;
    this.$$ax = 0; this.tempAx = 0;
    this.$$cameraDist  = 20;
    this.$$distToGround = this.$$cameraDist - 4
    /**
     * @type {number}
     */
    this.$$lng = 0;
    /**
     *
     * @type {number}
     */
    this.$$lat = 0;

    this.rotationMeshList = [];

    this.isDestroyed = false;

  }

  /**
   * @param {Element} el
   */
  init(el){




    this.isDestroyed = false
    this.$$el = el;
    const scene =this.scene =  new THREE.Scene();

    const camera = this.camera =  new THREE.PerspectiveCamera(30, el.clientWidth / el.clientHeight, 0.1, 1000);
    const renderer = this.renderer =  new THREE.WebGLRenderer({antialias: true});
    renderer.domElement.setAttribute('class', 'three-view')
    renderer.setClearColor('#000');
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const sunLight = this.sunLight	= new THREE.SpotLight( 0x888888, 1.8 )
    sunLight.position.set( -20, 10, 40 );
    const light2 = this.light2	= new THREE.SpotLight( 0x888888,0.2 )
    const zoom = 6;
    const faces =  Math.pow(2, zoom)
    /**
     * @type {EarthGeometry}
     */
    const sphereGeometry = this.sphereGeometry = new THREE.EarthGeometry(4, faces);
    const cloudsGeometry = new THREE.EarthGeometry(4.02, faces);
    const holeMaterial = new THREE.MeshBasicMaterial({ transparent: true});

    const groundMaterialList = ((i)=>{
      const m = []
      while (0<=i){
        m.push(new THREE.MeshPhongMaterial())
        i--
      }
      return m
    })(16);




    const cloudsMaterialList = ((i)=>{
      const m = []
      while (0<=i){
        m.push(new THREE.MeshPhongMaterial({transparent: true,opacity: 1/*, wireframe: true*/}))
        i--
      }
      return m

    })(16)



    //console.log(this.sphereGeometry.earhFaces)

    const glowMaterial = new THREE.ShaderMaterial(
      {
        uniforms:
          {
            c:   { type: "f", value: 0.9 },
            p:   { type: "f", value: 1.2 },
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


    getTiledImage({type:'ground', zoom:4}, ({canvas, load})=>{
      this.$data.groundLoad = parseInt(load*100) +'%'

    })
      .then(img=>{
        const texture = new THREE.Texture(img);
        const gm = groundMaterialList[4];
        gm.map = texture;
        gm.emissiveMap = texture;
        gm.needsUpdate = true;
        texture.needsUpdate = true;
        //this.$data.isShowGroundLoad = false
        $(this.$$el).find('.ground-load')[0].$fadeTo(1, 0, 500)
          .then(()=>{
            this.$data.isShowGroundLoad = false
          })
        

      })
    getTiledImage({type:'rain', zoom:4}, ({load}) =>{
      this.$data.cloudsLoad = parseInt(load*100) +'%'
    })
      .then(img=>{
        const texture = new THREE.Texture(img);
        const cm = cloudsMaterialList[4];
        cm.map = texture;
        cm.emissiveMap = texture;
        cm.needsUpdate = true;
        texture.needsUpdate = true;
        $(this.$$el).find('.clouds-load')[0].$fadeTo(1, 0, 500)
          .then(()=>{
            this.$data.isShowCloudsLoad = false
          })
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

    const rEarthMesh = this.rEarthMesh = new THREE.Mesh(sphereGeometry, groundMaterialList);
    //this.rEarthMesh.geometry.groupsNeedUpdate = true;
    const cloudsMesh = this.cloudsMesh = new THREE.Mesh(cloudsGeometry,  cloudsMaterialList);
    const glowMesh =  new THREE.Mesh( cloudsGeometry.clone(), glowMaterial )
    glowMesh.scale.multiplyScalar(1.01);
    //glowMesh.add(sprite)


    getImageWorker('../img/glow.png')
      .then(img=>{
        const spriteMaterial = new THREE.SpriteMaterial(
          {
            map: new THREE.Texture(img, {needsUpdate: true}),
            lights: true,
            color: 0xccddff, transparent: false, blending: THREE.AdditiveBlending
          })
        spriteMaterial.needsUpdate = true
        spriteMaterial.map.needsUpdate = true
        const sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(10, 10, 1.0);

        glowMesh.add(sprite)
      })


    //this.rotationMeshList.push(rEarthMesh, cloudsMesh);
    //this.rotationMeshList.push(rEarthMesh);

    this.setSunshine()

    rEarthMesh.position.x = 0;
    rEarthMesh.position.y = 0;
    rEarthMesh.position.z = 0;
    rEarthMesh.rotation.y = Math.PI/2
    cloudsMesh.rotation.y = Math.PI/2

    scene.add(rEarthMesh)
    scene.add(cloudsMesh)
    scene.add(glowMesh)
    scene.add(sunLight);
    scene.add( light2 );

    camera.position.z = this.$$cameraDist;
    camera.lookAt(rEarthMesh.position);
    light2.position.set(...['x', 'y', 'z'].map(key=>camera.position[key]))
    light2.lookAt(0,0,0)

    this.setCentralLngLat()
    getImageWorker('../img/galaxy_starfield.png')
      .then(img=>{
        const sphereGeometry = new THREE.SphereGeometry(300, 32, 32)
        const texture = new THREE.Texture(img);
        texture.needsUpdate = true;
        const m = new THREE.MeshBasicMaterial({
          side: THREE.BackSide,
          map: texture,
          clipIntersection: false
        });
        this.enviromentMesh = new THREE.Mesh(sphereGeometry, m);
        ['x', 'y', 'z'].map(key => {
          this.enviromentMesh.position[key] = this.camera.position[key]
        })
        scene.add( this.enviromentMesh)


      })


    // var skyMaterial = new THREE.ShaderMaterial( {
    //   fragmentShader: shader.fragmentShader,
    //   vertexShader: shader.vertexShader,
    //   uniforms: shader.uniforms,
    //   depthWrite: false,
    //   side: THREE.BackSide
    // } );



    let animaDate = 0;
    this.angle = {
      inertia: false,
      x:0,
      y:0,
      dx:0,
      dy:0
    };

    const anima = () => {
      if(this.angle.inertia){
        this.$$ax+=this.angle.dx
        if(0<this.angle.dx){
          this.angle.dx-=0.03
        }
        if(this.angle.dx<0){
          this.angle.dx+=0.03
        }
        if(Math.abs(this.angle.dx)<0.03){
          this.angle.dx = 0
        }

        this.$$ay+=this.angle.dy
        if(0<this.angle.dy){
          this.angle.dy-=0.05
        }
        if(this.angle.dy<0){
          this.angle.dy+=0.05
        }
        if(Math.abs(this.angle.dy)<0.05){
          this.angle.dy = 0

        }

        if(!this.angle.dy && !this.angle.dx) this.angle.inertia = false
        
        
        this.changeCameraPosition()
      }

      renderer.render(scene, camera);


      if(animaDate && !this.angle.inertia) {
        const  dt = Date.now() - animaDate;
        this.angle.dx = this.$$ax - this.angle.x
        this.angle.dy = this.$$ay - this.angle.y
      }
      animaDate = Date.now();
      this.angle.x = this.$$ax;
      this.angle.y = this.$$ay;


      if(!this.isDestroyed)
        requestAnimationFrame(anima);
    }
    anima()
    this.bindEvents();
    return this;
  }


  @autobind
  render(){
    requestAnimationFrame(()=>{
      this.renderer.render(this.scene, this.camera);
    })
  }

  /**
   * Считаем позицию sunLight источника света (типа солнца)
   * @return {EarthView}
   */
  setSunshine(){
    if(this.isDestroyed) return this;
    const R = 40;
    const d = new Date();

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);


    const sek = ((d.getHours() + d.getTimezoneOffset()/60) *3600) + (d.getMinutes()*60) + d.getSeconds();
    const a = 360*sek/(3600*24);
    const yearDays = (new Date(d.getFullYear(),11,31) - new Date(d.getFullYear(),0,0))/86400000;
    const t = 23.45*Math.sin(Math.radians(360*(284+dayOfYear)/yearDays));

    const z = -1 * R * Math.cos(Math.radians(a));
    const x = R * Math.sin(Math.radians(a));
    const y = R*Math.sin(Math.radians(t));
    this.sunLight.position.set(x, y, z);
    setTimeout(this.setSunshine.bind(this), 1000);
    return this
  }

  changeCameraPosition(){


    if(90<this.$$ay) this.$$ay = 90
    if(this.$$ay<-90) this.$$ay = -90

    const ayRad = Math.radians(this.$$ay);
    const axRad = Math.radians(this.$$ax);
    const z1 = this.$$cameraDist*Math.cos(ayRad)
    const y1 = this.$$cameraDist*Math.sin(ayRad)
    const dx2 = z1 * Math.sin(axRad);
    let dz2 = z1 * Math.cos(axRad);
    this.camera.position.y = y1;
    this.camera.position.x = dx2;
    this.camera.position.z = dz2;
    this.camera.lookAt(this.rEarthMesh.position);
    if(this.enviromentMesh){
      this.enviromentMesh.position.set(...['x', 'y', 'z'].map(key=>this.camera.position[key]))
    }
    this.light2.position.set(...['x', 'y', 'z'].map(key=>this.camera.position[key]))
    this.setCentralLngLat();
  }

  setCentralLngLat(){
    const ax = 0<this.$$ax ? (this.$$ax - parseInt(this.$$ax/360)*360) : (360*(parseInt(-this.$$ax/360)+1) + this.$$ax)
    if(180<ax){
      this.$$lng =  (ax - 360)
    }else {
      this.$$lng = ax
    }
    this.$$lat = this.$$ay;


    //TODO обновление поверхности начинается тут
   // this.sphereGeometry.setScreenLngLat(this.$$lng, this.$$lat, this.zoom)
    //this.rEarthMesh.geometry.groupsNeedUpdate = true;
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
    e.stopPropagation();
    this.angle.inertia = false;
    this.tx = e.clientX
    this.ty = e.clientY
    this.tempAy = this.$$ay
    this.tempAx = this.$$ax
    this.$$el.removeEventListener('mousemove', this.mousmove);
    this.$$el.addEventListener('mousemove', this.mousmove)
  }
  @autobind
  mouseup(e){
    this.$$el.removeEventListener('mousemove', this.mousmove)
    this.angle.inertia = true;
  }

  @autobind
  onweel(e){
    let dy = (e.deltaY*0.002);
    const k = this.$$cameraDist - 4.1;
    this.$$cameraDist = this.$$cameraDist+(dy*k);
    this.$$distToGround = this.$$cameraDist - 4
    this.changeCameraPosition()
  }

  get zoom() {
    switch (true) {
      case 10 < this.$$distToGround:
        return 4;
      case 5 < this.$$distToGround:
        return 5;
      case 2 < this.$$distToGround:
        return 6;
      case 1 < this.$$distToGround:
        return 7;
      default:
        return 8;
    }
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




export const EarthComponent = Vue.component('android-component', {
  template: template(),
  data: function () {
    return {
      groundLoad: '0%',
      isShowGroundLoad: true,
      cloudsLoad: '0%',
      isShowCloudsLoad: true
    }
  },
  mounted: function(e) {



      earthView = new EarthView(this.$data)
      defineload('THREE')
        .then(t=>{
          THREE = t;
          return mySphereInit()
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
