const moduleMap = {
  'THREE': './lib/three.js'
};

const module = {};



function evalInContext(js, context) {
  return function () {
    return eval(js);
  }.call(context);
}


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}


function loadPromise(url) {
  return new Promise((resolve, reject)=>{
    var xhr = createCORSRequest("GET", url);
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onerror = function (e) {
      reject(e);
    };
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        resolve(xhr.response)
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.send();
  });
}
/**
 *
 * @param name
 * @param callback
 * @return {Promise.<T>}
 */
export default function defineload(name, callback) {
  return new Promise((resolve, reject)=>{
    if(module[name]){
      resolve(module[name])
      if(callback) callback(module[name])
    } else {
      loadPromise(moduleMap[name])
        .then(arrayBuf=>{
          const reader = new FileReader();
          reader.onload = () => {
            //console.log(reader.result);
            const text = reader.result;
            evalInContext(`(function(global) {let module; ` +text+ `;}).call(this)`, module)
            resolve(module[name])
            if(callback) callback(module[name])
          };
          reader.readAsText(new Blob([new Uint8Array(arrayBuf)]));
        })
    }
  })
}