import {center} from './radar-center'
import {xy} from './get-direction';

export class CanvasDirection{
	/**
	 *
	 * @param {Element}element
	 */
	constructor(element){
		this.el = element.cloneNode(false) || document.createElement('canvas');
		this.el.style.width = '100%';
		this.el.style.height = '100%';
		this.el.style.zIndex = '99';
		this.el.style.position = 'absolute';
		this.el.style.left = '0';
		this.el.style.top = '0';
		this._context = this.el.getContext("2d");
		Object.assign(this, this.el)

	}
	get context(){
		return this._context;
	}

	/**
	 *
	 * @param {number}x
	 * @param {number}y
	 * @param {number}a angle
	 */
	draw(x, y, a){
		const ctx =this._context;

		const p1 = this._xy(x,y, a-15);
		const p2 = this._xy(x,y, a+15);



		ctx.clearRect(0, 0, this.el.width, this.el.height);
		ctx.fillStyle = 'rgba(255,0,0,0.1)';
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();

		ctx.fill();

		ctx.beginPath();
		ctx.arc(center.x, center.y, center.R, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(0,0,255,0.4)';
		ctx.stroke();


	}

	drawCircle(center){
		const ctx =this._context;
		ctx.beginPath();
		ctx.arc(center.x, center.y, 5, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.fillStyle = 'rgba(0,255,255,1)';
		ctx.strokeStyle = 'rgba(0,255,255,1)';
		ctx.fill();
	}


	/**
	 *
	 * @param {number} a
	 * @return {{x: number, y: number}}
	 * @private
	 */
	_xy(x, y, a){
		const R = 600;
		return xy({
			x,y,R
		}, a)
	}


}

