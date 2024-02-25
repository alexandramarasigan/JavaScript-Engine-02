import {Vec} from './vector.js';

export class Rect {
	constructor(pos, w, h) {
		this.position = pos;
		this.width = w;
		this.height = h;

        this.orientation = 0;
	}

	draw(ctx, strokeColor, fillColor) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.orientation);
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(
                - this.width/2,
                - this.height/2,
                this.width,
                this.height,
            );
        }
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
       	ctx.strokeRect(
            - this.width/2,
            - this.height/2,
            this.width,
            this.height,
        );
        ctx.restore();
    }

}