"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deferred = void 0;
class Deferred {
    constructor(i) {
        this._i = i;
        this._res = null;
        this._rej = null;
        this._d = null;
        this._j = null;
        this._promise = new Promise((res, rej) => {
            this._res = res;
            this._rej = rej;
            if (this._d)
                this._res(this._d);
            if (this._j)
                this._rej(this._j);
        });
    }
    resolve(d) {
        if (this._res) {
            this._res(d);
        }
        else {
            this._d = d;
        }
        return this;
    }
    reject(j) {
        if (this._rej)
            this._rej(j);
        else
            this._j = j;
        return this;
    }
    get promise() {
        return this._promise;
    }
    get i() {
        return this._i;
    }
}
exports.Deferred = Deferred;
//# sourceMappingURL=deferred.class.js.map