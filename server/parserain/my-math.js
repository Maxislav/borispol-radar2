"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyMath = void 0;
const M = {
    radians: function (degrees) {
        return degrees * Math.PI / 180;
    },
    degrees: function (radians) {
        return radians * 180 / Math.PI;
    },
    getRandom: function (min, max, int) {
        let rand = min + Math.random() * (max - min);
        if (int) {
            rand = Math.round(rand);
        }
        return rand;
    },
    normalizeDegree: (alpha) => {
        const floor = Math.ceil(alpha / 360);
        if (360 < alpha) {
            alpha = alpha - floor * 360;
        }
        if (alpha < 0) {
            alpha = 360 + alpha;
        }
        return alpha;
    },
    toFixed: (value, n) => {
        return (Math.round(value * Math.pow(10, n || 0)) / Math.pow(10, n || 0)).toFixed(n || 0);
    }
};
exports.MyMath = Object.assign(Object.create(Math), M);
//# sourceMappingURL=my-math.js.map