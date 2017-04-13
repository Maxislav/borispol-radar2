



/**
 *
 * @param {number}from
 * @param {number}to
 * @param {number}delay
 * @param {number?} istop
 * @returns {Promise.<Node>}
 */
Node.prototype.$fadeTo = function (from, to, delay, istop) {
	this.style.opacity = from + '';
	this.style.transition = 'opacity ' + (delay) + 'ms';
	let i = 0;

	setTimeout(() => {
		this.style.opacity = to + ''
	}, 10);

	return new Promise((resolve) => {
		const timer = setInterval(()=>{
			i++;
			if(istop && istop<i/(delay/20)){
				resolve(this)
			}
		},20);
		setTimeout(() => {
			resolve(this)
			clearInterval(timer);
			this.style.transition = ''
		}, delay - 10);

	});
};