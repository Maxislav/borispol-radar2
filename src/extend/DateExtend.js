Date.prototype.toUtc = function () {
	const offset = new Date().getTimezoneOffset()*60000;
	return new Date(Date.now() + offset)
};
