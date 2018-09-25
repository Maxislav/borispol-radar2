
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
export function _position(el) {
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


export function __position( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { y: _y, x: _x };
}

function getDocumentScroll() {
	return {
		y: window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0),
		x: window.scrollX || window.pageXOffset || document.body.scrollLeft + (document.documentElement && document.documentElement.scrollLeft || 0)
	}
}

export function position(el) {
    var sOff = dw_getScrollOffsets(), left = 0, top = 0, props;

    if ( el.getBoundingClientRect ) {
        props = el.getBoundingClientRect();
        left = props.left + sOff.x;
        top = props.top + sOff.y;
    } else { // for older browsers
        do {
            left += el.offsetLeft;
            top += el.offsetTop;
        } while ( (el = el.offsetParent) );
    }
    return { x: Math.round(left - getDocumentScroll().x), y: Math.round(top - getDocumentScroll().y) };
}

function dw_getScrollOffsets() {
    var doc = document, w = window;
    var x, y, docEl;

    if ( typeof w.pageYOffset === 'number' ) {
        x = w.pageXOffset;
        y = w.pageYOffset;
    } else {
        docEl = (doc.compatMode && doc.compatMode === 'CSS1Compat')?
            doc.documentElement: doc.body;
        x = docEl.scrollLeft;
        y = docEl.scrollTop;
    }
    return {x:x, y:y};
}