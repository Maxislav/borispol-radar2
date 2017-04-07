import {center} from './radar-center'

export function xy(center, a) {

	if(360<a){
		a = a-360
	}

	let x, y;
	switch (true) {
		case a < 90:
			x = Math.round(center.x + Math.sin(Math.radians(a)) * center.R);
			y = Math.round(center.y - Math.cos(Math.radians(a)) * center.R);
			break;
		case a < 180:
			x = Math.round(center.x + Math.sin(Math.radians(180-a)) * center.R);
			y = Math.round(center.y + Math.cos(Math.radians(180-a)) * center.R);
			break;
		case a < 270:
			x = Math.round(center.x - Math.sin(Math.radians(a-180)) * center.R);
			y = Math.round(center.y + Math.cos(Math.radians(a-180)) * center.R);
			break;
		default:
			x = Math.round(center.x - Math.sin(Math.radians(360-a)) * center.R);
			y = Math.round(center.y - Math.cos(Math.radians(360-a)) * center.R);
	}

	return {x,y}
}

/**
 *
 * @param arrData
 * @return {number|null}
 */
export function getDirection(arrData) {
	const _ = {
		/**
		 *
		 * @param arr
		 * @return {number}
		 */
		sum: (arr) => {
			return arr.filter(a => a !== undefined).reduce(function (a, b) {
				return a + b
			}, 0)
		},
		/**
		 *
		 * @param arr
		 * @return {number}
		 */
		average: (arr) => {
			return _.sum(arr) / arr.length
		}
	};
	const res = [];
	for (let a = 0.5; a < 360; a += 0.5) {
		const {x, y} = xy(center, a)
		if (arrData[x][y].r == arrData[x][y].g && arrData[x][y].r < 5) {
			res.push(a)
		}
	}

	return res.length ? _.average(res) : null
}
