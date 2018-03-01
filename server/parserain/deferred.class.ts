export class Deferred{
    private _i: number;
    private _res: null | Function;
    private _res: null | Function;
    private _rej: null | Function;
    private _d: any;
    private _j: any;
    private _promise: Promise;


    constructor(i){

        this._i  = i;
        this._res = null;
        this._rej = null;
        this._d = null;
        this._j = null
        this._promise = new Promise((res, rej)=>{
            this._res = res;
            this._rej = rej;
            if(this._d) this._res(this._d);

            if(this._j) this._rej(this._j);
        });
    }

    resolve(d){
        if(this._res){
            this._res(d);
        } else {
            this._d = d;
        }
    }

    reject(j){
        if(this._rej) this._rej(j)
        else this._j = j;
    }

    get promise(){
        return this._promise
    }

    get i (){
        return this._i;
    }

}

