import {Vec} from './vector.js';
import {Aabb} from './aabb.js';

export class Circle {
	constructor(pos, r) {
		this.position = pos
		this.radius = r;
        this.aabb = new Aabb(new Vec(pos.x - r, pos.y - r), new Vec(pos.x + r, pos.y + r));
	}
    
    updateAabb() {
        //you have not yet defined the method set in vector!
        this.aabb.min.set(this.position.x - this.radius, this.position.y - this.radius);
        this.aabb.max.set(this.position.x + this.radius, this.position.y + this.radius);
    }

	draw(ctx, strokeColor, fillColor) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true);
        ctx.closePath();
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}	