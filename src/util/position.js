
export function windowSize() {
	return {
		height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
		width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	}
}

/**
 *
 * @param {HTMLElement | Node}el
 * @return {{x:number, y: number}}
 */
export function position(el) {
	let el2 = el;
	let top = 0;
	let left = 0;
	if (document.getElementById || document.all) {
		do {
			left += el.offsetLeft - el.scrollLeft;
			top += el.offsetTop - el.scrollTop;
			el = el.offsetParent;
			el2 = el2.parentNode;
			while (el2 != el) {
				left -= el2.scrollLeft;
				top -= el2.scrollTop;
				el2 = el2.parentNode;
			}
		} while (el && el.offsetParent);

	} else if (document.layers) {
		top += el.y;
		left += el.x;
	}
	return {
		x: left,
		y: top
	};
}

