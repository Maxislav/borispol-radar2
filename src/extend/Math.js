/**
 * Converts from degrees to radians.
 * @param {number} degrees
 * @return {number}
 */
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

/**
 *
 * @param {number} radians
 * @return {number}
 */
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

Math.normalizeDegree = (alpha)=>{
    const floor = Math.ceil(alpha/360);
    if(360<alpha){
        alpha = alpha-floor*360
    }
    if(alpha<0){
        alpha = 360+alpha
    }
return alpha
};
Math.toFixed = (value, n)=> {
	return (Math.round(value * Math.pow(10, n || 0)) / Math.pow(10, n || 0)).toFixed(n || 0)
};

