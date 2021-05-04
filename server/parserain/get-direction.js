"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirection = void 0;
const radar_center_const_1 = require("./radar-center.const");
const my_math_1 = require("./my-math");
/**
 * @param {RadarCenter}_center
 * @param {number}a угол 0 ... 360
 * @return {{x: number, y: number}}
 */
const xy = (_center, a) => {
    if (360 < a) {
        a = a - 360;
    }
    let x, y;
    switch (true) {
        case a < 90:
            x = my_math_1.MyMath.round(_center.x + my_math_1.MyMath.sin(my_math_1.MyMath.radians(a)) * _center.R);
            y = my_math_1.MyMath.round(_center.y - my_math_1.MyMath.cos(my_math_1.MyMath.radians(a)) * _center.R);
            break;
        case a < 180:
            x = my_math_1.MyMath.round(_center.x + my_math_1.MyMath.sin(my_math_1.MyMath.radians(180 - a)) * _center.R);
            y = my_math_1.MyMath.round(_center.y + my_math_1.MyMath.cos(my_math_1.MyMath.radians(180 - a)) * _center.R);
            break;
        case a < 270:
            x = my_math_1.MyMath.round(_center.x - my_math_1.MyMath.sin(my_math_1.MyMath.radians(a - 180)) * _center.R);
            y = my_math_1.MyMath.round(_center.y + my_math_1.MyMath.cos(my_math_1.MyMath.radians(a - 180)) * _center.R);
            break;
        default:
            x = my_math_1.MyMath.round(_center.x - my_math_1.MyMath.sin(my_math_1.MyMath.radians(360 - a)) * _center.R);
            y = my_math_1.MyMath.round(_center.y - my_math_1.MyMath.cos(my_math_1.MyMath.radians(360 - a)) * _center.R);
    }
    return { x, y };
};
/**
 *
 * @param {ImageMatrix} imageMatrix
 * @return {number|null}
 */
function getDirection(imageMatrix) {
    const _ = {
        /**
         *
         * @param arr
         * @return {number}
         */
        sum: (arr) => {
            return arr.filter(a => a !== undefined).reduce(function (a, b) {
                return a + b;
            }, 0);
        },
        /**
         *
         * @param arr
         * @return {number}
         */
        average: (arr) => {
            return _.sum(arr) / arr.length;
        }
    };
    const res = [];
    for (let a = 0.5; a < 360; a += 0.5) {
        const { x, y } = xy(radar_center_const_1.RadarCenter, a);
        if (imageMatrix[x][y].r == imageMatrix[x][y].g && imageMatrix[x][y].r < 5) {
            res.push(a);
        }
    }
    return res.length ? _.average(res) : null;
}
exports.getDirection = getDirection;
//# sourceMappingURL=get-direction.js.map