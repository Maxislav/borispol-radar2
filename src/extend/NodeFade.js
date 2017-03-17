
/**
 *
 * @param {number}from
 * @param {number}to
 * @param {number}delay
 * @param {Function?}callback
 * @returns {Promise.<Node>}
 */
Node.prototype.$fadeTo = function (from, to, delay, callback) {
	this.style.opacity = from + '';
	this.style.transition = 'opacity ' + (delay) + 'ms';
	setTimeout(() => {
		this.style.opacity = to + ''
	}, 10);

	return new Promise((resolve) => {
		setTimeout(() => {
			callback && callback(this);
			resolve(this)
			this.style.transition = ''
		}, delay - 10);

	});
};