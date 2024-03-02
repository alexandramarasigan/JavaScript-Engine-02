import {Vec} from './vector.js';
import {Aabb} from './/aabb.js';

export class Rect {
	constructor(pos, w, h) {
		this.position = pos;
		this.width = w;
		this.height = h;

        this.orientation = 0;

        this.vertices = [new Vec (0, 0), new Vec (0, 0), new Vec (0, 0), new Vec (0, 0)];
        this.aabb = new Aabb(new Vec (0, 0), new Vec (0, 0));
	}

    updateVertices() {
        this.vertices[0].setX(-this.width/2).setY(-this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[1].setX(this.width/2).setY(-this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[2].setX(this.width/2).setY(this.height/2).rotate(this.orientation).add(this.position);
        this.vertices[3].setX(-this.width/2).setY(this.height/2).rotate(this.orientation).add(this.position);
    }

    updateAabb() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;
        let vertexX;
        let vertexY;

        for (let i=0; i<this.vertices.length; i++) {
            vertexX = this.vertices[i].x;
            vertexY = this.vertices[i].y;

            minX = vertexX < minX ? vertexX : minX;

        }
        this.aabb.min.x = minX;

        this.aabb.max.x = maxX;
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