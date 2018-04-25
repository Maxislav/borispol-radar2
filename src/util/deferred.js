


export class Deferred{

    constructor(i){

        this._i  = i;
        this._res = null;
        this._rej = null;
        this._d = null;
        this._j = null;
        this._status = 0;

        this._promise = new Promise((res, rej)=>{
            this._res = res;
            this._rej = rej;
            if(this._d) {
                this._res(this._d);
                this._status  = 1
            }
            if(this._j) {
                this._rej(this._j);
                this._status  = 2
            }
        });
    }

    resolve(d){
        if(this._res){
            this._res(d);
            this._status  = 1
        } else {
            this._d = d;
        }
        return this
    }

    reject(j){
        if(this._rej) {
            this._rej(j)
            this._status  = 2
        }
        else this._j = j;
        return this
    }

    get promise(){
        return this._promise
    }

    get i (){
        return this._i;
    }

    get status(){
        return this._status
    }

}



