// Converts from degrees to radians.
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};
/**
 * @param {number} min
 * @param {number}max
 * @param {boolean}int
 * @returns {number}
 */
Math.getRandom =  function(min, max, int) {
    let rand = min + Math.random() * (max - min);
    if(int){
        rand = Math.round(rand)
    }
    return rand;
};
