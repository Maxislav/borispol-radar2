
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


function loadPromise(name, url) {
  return new Promise((resolve, reject)=>{
    var xhr = createCORSRequest("GET", url);
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onerror = function (e) {

      postMessage({
        error: {
          url: url,
          error: xhr.status
        },
        name
      })
      reject(e);

    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        resolve(xhr.response);
      } else {
        postMessage({
          error: {
            url: url,
            error: xhr.status
          },
          name
        })
        reject({
          url: url,
          error: xhr.status
        });
      }
    };
    xhr.send();
  });
}


onmessage = (e) =>{
  const {name, data} = e.data
  loadPromise(name, data)
    .then(arrayBuffer=>{
      postMessage({
        data: arrayBuffer,
        name
      })
    })
    .catch(err=>{


    })
}
