import {constantRadarColor} from './color.const'
import {MyMath} from './my-math';
import {getDirection} from './get-direction'



/**
 * @extends Array
 */
export class ImageMatrix<T> extends Array<any>{
    private _width: number;
    private _height: number;
    private _scale: number;
    private _direction: undefined | number;
    private list: null | Array<Array<number>>;
    private _isRainy: boolean;

    constructor(width, height) {
        super();
        Object.create(ImageMatrix.prototype);
        this._width = width;
        this._height = height;
        this._scale = 420 / height;

        this._direction = undefined;

        for (let x = 0; x < this._width; x++) {
            if (!this[x]) this[x] = [];
        }
        this.list = null;
        this._isRainy = false;


    }

    toArray(): Array<any> {
        if (!this.list) {
            this.list = [];
            for (let x = 0; x < this._width; x++) {
                for (let y = 0; y < this._height; y++) {
                    this.list.push(this[x][y])
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
            return constantRadarColor.find((val) => {
                const find = Math.abs(item.dec - val.colorDec) < 1000;
                if (find) {
                    item.text = val.text;
                    item.intensity = val.intensity
                    if(!this._isRainy) this._isRainy = true
                }
                return find
            });
        });

        const filterByDirection = filterByColor.filter(p=>{
            if(a) {
                a = MyMath.normalizeDegree(a);
                let _a;
                const {x, y} = origin;
                if (x < p.x && p.y < y) {
                    _a = (Math.atan((p.x - x) / (y - p.y)))
                } else if (x < p.x && y < p.y) {
                    _a = (Math.atan((p.y - y) / (p.x - x))) + Math.PI / 2
                } else if (p.x < x && y < p.y) {
                    _a = (Math.atan((x - p.x) / (p.y - y))) + Math.PI
                } else {
                    _a = (Math.atan((y - p.y ) / (x - p.x))) + 3 * Math.PI / 2
                }
                _a = MyMath.degrees(_a);
                return Math.abs(a - _a) < 15
            }
            else return true;
        });

        filterByDirection.forEach(r => {
            r.setDistFrom(origin.x, origin.y)
        });

        filterByDirection.sort((a, b) => {
            if (a.dist < b.dist) {
                return -1
            }
            if (b.dist < a.dist) {
                return 1
            }
            if (a.dist == b.dist) {
                return 0
            }
        });

        const colors = [];


        return filterByDirection
            .filter(function (value, index, arr) {
                const find = colors.find((val) => {
                    return Math.abs(value.dec - val) < 10
                });
                if (!find && (100 < value.r || 100 < value.g || 100 < value.b )) {
                    colors.push(value.dec);
                    return true
                }
                return false
            })
            .map(it => {
                return {
                    intensity: it.intensity,
                    dist: parseInt(it.dist),
                    text: it.text,
                    x: it.x,
                    y: it.y
                }
            })
    }
    isRainy(){
        return this._isRainy
    }


    public getDirection(){
        if(this._direction === undefined){
            this._direction = getDirection(this)
        }
        return this._direction;
    }


    distByLatLng(origin: {lng: number, lat: number}){
        const  direction = this.getDirection();

        const a = direction ? direction + 180 : null;

        const x = (this._width/(33.8-27.9)) *(origin.lng - 27.9);
        const y = (this._height/(52-48.8))* (52 - origin.lat);

        console.log('lng lat - >', origin.lng+", " +origin.lat, " x: "+ x, "y: "+y)

        return this.distByPixel({x,y}, a);
    }

    clear(){
        while (this.length){
            this.pop()
        }
    }




}

