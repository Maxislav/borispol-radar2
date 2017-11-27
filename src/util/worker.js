import {Deferred} from './deferred'

export class $Worker{
  constructor(path){
    this.worker = new Worker(path);
    this.deferred = {}

    this.worker.onmessage = ({data}) => {
      if(this.deferred[data.name] && this.deferred[data.name].status == 0){
        this.deferred[data.name].resolve(data.data)
      }else {
        this.deferred[data.name].reject('Still progress..')
      }
    }
  }


  /**
   * @param {string} name
   * @param {*} data
   */
  post(name, data){
    this.deferred[name] = new Deferred()
    this.worker.postMessage({
      name,
      data
    })
    return  this.deferred[name].promise
  }

  destroy(){
    this.worker.terminate()
  }
}