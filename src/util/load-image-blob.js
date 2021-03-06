const images = {};
import {Deferred} from './deferred'

class MyImage extends window.Image {
    toCanvas(w, h, w1, h1, x, y) {
        const canvas = document.createElement('canvas');
        canvas.width = w ? w : this.width;
        canvas.height = h ? h : this.height;
        const ctx = canvas.getContext('2d')
        if (!w1 && !h1) {
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height)
        } else {
            ctx.drawImage(this, 0, 0, this.width, this.height, x || 0, y || 0, w1, h1)
        }
        //ctx.drawImage(this,0, 0, canvas.width, canvas.height, x || 0, y || 0, w1 || canvas.width , h1 || canvas.height);
        //ctx.drawImage(this,0, 0, canvas.width, canvas.height, x || 0, y || 0, w1 || canvas.width , h1 || canvas.height);
        return canvas
    }
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
    return new Promise((resolve, reject) => {
        var xhr = createCORSRequest("GET", url);
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onerror = function (e) {
            reject(e);
        };
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
                const imgData = xhr.response;
                const img = new Image();
                const blob = new window.Blob([new Uint8Array(imgData)], {type: 'image/png'});
                img.onload = function () {
                    (window.URL || window.webkitURL).revokeObjectURL(img.src);
                    resolve(img);
                };
                img.src = (window.URL || window.webkitURL).createObjectURL(blob);
            } else {
                reject(new Error(xhr.statusText));
            }
        };
        xhr.send();
    });
}

let worker;
const workerDeferred = {}
const workerList = []

export function getImage(url, cache) {
    if (cache) {
        if (!images[url]) {
            images[url] = loadPromise(url)
        }
        return images[url]
    } else {
        return loadPromise(url)
    }
}


export function getImageWorker(url) {
    if (!worker) {
        worker = new Worker('./worker/load-image.worker.js')
        worker.onmessage = ({data}) => {
            if (workerDeferred[data.name] && workerDeferred[data.name].status == 0) {
                if (!data.error) {
                    const imgData = data.data
                    // workerDeferred[data.name].img
                    const blob = new window.Blob([new Uint8Array(imgData)], {type: 'image/png'});
                    workerDeferred[data.name].img.onload = function () {
                        // (window.URL || window.webkitURL).revokeObjectURL(img.src);

                        setTimeout(() => {
                            workerDeferred[data.name].resolve(workerDeferred[data.name].img)
                            delete workerDeferred[data.name].img
                        }, Math.getRandom(10, 200, true))

                    };
                    workerDeferred[data.name].img.src = (window.URL || window.webkitURL).createObjectURL(blob);
                } else {
                    workerDeferred[data.name].reject(data.error)
                }
            } else {
                console.error('Rrr workerDeferred->')
                workerDeferred[data.name].reject()
            }
        }
    }


    if (!workerDeferred[url]) {
        workerDeferred[url] = new Deferred();
        workerDeferred[url].img = new Image()
        setTimeout(() => {
            worker.postMessage({
                name: url,
                data: url
            });
        }, Math.getRandom(5, 50, true))

    }


    return workerDeferred[url].promise
}


export class Canvas {
    constructor(width, height) {

        const canvas = this.instance = document.createElement('canvas');
        this.width = canvas.width = width;
        this.height = canvas.height = height;
        this.context = canvas.getContext('2d');
        this.context.font = "20px Arial";
        this.context.fillStyle = "red";
        this.context.strokeStyle = "blue";

    }

    drawImage(...args) {
        this.context.drawImage(...args)
        return this;
    }

    /**
     * @return {Promise}
     */
    getImage() {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                resolve(img)
            }
            img.src = this.instance.toDataURL("image/png")
        })
    }

    fillText(...args) {
        this.context.fillText(...args);
        return this
    }


    fillStyle(color) {
        this.context.fillStyle = color;
        return this
    }

    strokeStyle(color) {
        this.context.strokeStyle = color
        return this
    }

    rect(...args) {
        this.context.rect(...args);
        this.context.stroke();
        return this;
    }

    cutTo256(x, y, width, height) {
        const imgData = this.context.getImageData(x, y, width, height);
        this.instance.width = width;
        this.instance.height = height;
        this.context = this.instance.getContext('2d');
        this.context.putImageData(imgData, 256, 256)

    }

    getImageData(...args) {
        return this.context.getImageData(...args)
    }

    putImageData(...args) {
        this.context.putImageData(...args)
        return this
    }


}
