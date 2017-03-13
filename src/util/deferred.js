"use strict";
function Deferred() {
	var _this = this;
	this.status = 0;
	this.promise = new Promise(function (resolve, reject) {
		_this._resolve = resolve;
		_this._reject = reject;
	});
}
Deferred.prototype.resolve = function (value) {
	this._resolve(value);
	this.status = 1;
};
Deferred.prototype.reject = function (value) {
	this.status = 2;
	this._reject(value);
};
export {Deferred}

//# sourceMappingURL=deferred.js.map