"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_const_1 = require("./color.const");
const my_math_1 = require("./my-math");
const get_direction_1 = require("./get-direction");
/**
 * @extends Array
 */
class ImageMatrix extends Array {
    constructor(width, height) {
        super();
        Object.create(ImageMatrix.prototype);
        this._width = width;
        this._height = height;
        this._scale = 420 / height;
        this._direction = undefined;
        for (let x = 0; x < this._width; x++) {
            if (!this[x])
                this[x] = [];
        }
        this.list = null;
        this._isRainy = false;
    }
    toArray() {
        if (!this.list) {
            this.list = [];
            for (let x = 0; x < this._width; x++) {
                for (let y = 0; y < this._height; y++) {
                    this.list.push(this[x][y]);
                }
            }
        }
        return this.list;
    }
    /**
     *
     * @param {{x:number, y:number}} origin координата в пикселях
     * @param {number | null} a угол ветра
     * @return {Array}
     */
    distByPixel(origin, a) {
        let rain = this.toArray();
        const filterByColor = rain.filter((item) => {
            return color_const_1.constantRadarColor.find((val) => {
                const find = Math.abs(item.dec - val.colorDec) < 1000;
                if (find) {
                    item.text = val.text;
                    item.intensity = val.intensity;
                    if (!this._isRainy)
                        this._isRainy = true;
                }
                return find;
            });
        });
        const filterByDirection = filterByColor.filter(p => {
            if (a) {
                a = my_math_1.MyMath.normalizeDegree(a);
                let _a;
                const { x, y } = origin;
                if (x < p.x && p.y < y) {
                    _a = (Math.atan((p.x - x) / (y - p.y)));
                }
                else if (x < p.x && y < p.y) {
                    _a = (Math.atan((p.y - y) / (p.x - x))) + Math.PI / 2;
                }
                else if (p.x < x && y < p.y) {
                    _a = (Math.atan((x - p.x) / (p.y - y))) + Math.PI;
                }
                else {
                    _a = (Math.atan((y - p.y) / (x - p.x))) + 3 * Math.PI / 2;
                }
                _a = my_math_1.MyMath.degrees(_a);
                return Math.abs(a - _a) < 15;
            }
            else
                return true;
        });
        filterByDirection.forEach(r => {
            r.setDistFrom(origin.x, origin.y);
        });
        filterByDirection.sort((a, b) => {
            if (a.dist < b.dist) {
                return -1;
            }
            if (b.dist < a.dist) {
                return 1;
            }
            if (a.dist == b.dist) {
                return 0;
            }
        });
        const colors = [];
        return filterByDirection
            .filter(function (value, index, arr) {
            const find = colors.find((val) => {
                return Math.abs(value.dec - val) < 10;
            });
            if (!find && (100 < value.r || 100 < value.g || 100 < value.b)) {
                colors.push(value.dec);
                return true;
            }
            return false;
        })
            .map(it => {
            return {
                intensity: it.intensity,
                dist: parseInt(it.dist),
                text: it.text,
                x: it.x,
                y: it.y
            };
        });
    }
    isRainy() {
        return this._isRainy;
    }
    getDirection() {
        if (this._direction === undefined) {
            this._direction = get_direction_1.getDirection(this);
        }
        return this._direction;
    }
    distByLatLng(origin) {
        const direction = this.getDirection();
        const a = direction ? direction + 180 : null;
        const x = (this._width / (33.8 - 27.9)) * (origin.lng - 27.9);
        const y = (this._height / (52 - 48.8)) * (52 - origin.lat);
        console.log('lng lat - >', origin.lng + ", " + origin.lat, " x: " + x, "y: " + y);
        try {
            const dist = this.distByPixel({ x, y }, a);
            console.log('distByPixel ->', dist);
            return dist;
        }
        catch (error) {
            console.error('distByPixel err', error);
        }
    }
    clear() {
        while (this.length) {
            this.pop();
        }
    }
}
exports.ImageMatrix = ImageMatrix;
//# sourceMappingURL=image-matrix.class.js.map