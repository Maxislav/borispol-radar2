import {RadarCenter as center } from './radar-center.const'
import {MyMath } from './my-math'


/**
 * @param {RadarCenter}_center
 * @param {number}a угол 0 ... 360
 * @return {{x: number, y: number}}
 */
const xy = (_center, a) =>{

    if(360<a){
        a = a-360
    }

    let x, y;
    switch (true) {
        case a < 90:
            x = MyMath.round(_center.x + MyMath.sin(MyMath.radians(a)) * _center.R);
            y = MyMath.round(_center.y - MyMath.cos(MyMath.radians(a)) * _center.R);
            break;
        case a < 180:
            x = MyMath.round(_center.x + MyMath.sin(MyMath.radians(180-a)) * _center.R);
            y = MyMath.round(_center.y + MyMath.cos(MyMath.radians(180-a)) * _center.R);
            break;
        case a < 270:
            x = MyMath.round(_center.x - MyMath.sin(MyMath.radians(a-180)) * _center.R);
            y = MyMath.round(_center.y + MyMath.cos(MyMath.radians(a-180)) * _center.R);
            break;
        default:
            x = MyMath.round(_center.x - MyMath.sin(MyMath.radians(360-a)) * _center.R);
            y = MyMath.round(_center.y - MyMath.cos(MyMath.radians(360-a)) * _center.R);
    }

    return {x,y}
}

/**
 *
 * @param {ImageMatrix} imageMatrix
 * @return {number|null}
 */
export function getDirection(imageMatrix) {
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
        if (imageMatrix[x][y].r == imageMatrix[x][y].g && imageMatrix[x][y].r < 5) {
            res.push(a)
        }
    }

    return res.length ? _.average(res) : null
}

