import {Vec} from './vector.js';
import {Aabb} from './aabb.js';

export class Rect {
	constructor(pos, w, h, material) {
		this.position = pos;
		this.width = w;
		this.height = h;
        this.material = material;

        this.orientation = 0;

        this.vertices = [new Vec(0,0),new Vec(0,0),new Vec(0,0),new Vec(0,0)];
        this.aabb = new Aabb(new Vec(0,0),new Vec(0,0));
	}

    //0 1
    //3 2

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
            //find the min and max x and y
            minX = vertexX < minX ? vertexX : minX; 
            maxX = vertexX > maxX ? vertexX : maxX;
            minY = vertexY < minY ? vertexY : minY;
            maxY = vertexY > maxY ? vertexY : maxY;

        }
        //store min and max y in aabb
        this.aabb.min.x = minX;
        this.aabb.min.y = minY;
        this.aabb.max.x = maxX;
        this.aabb.max.y = maxY;
    }

    calculateMass(density) {
        const area = this.width * this.height;
        return area * density;
    }

    calculateInertia(mass) {
        const inertia = 1/12 * mass * (this.width * this.width + this.height * this.height);  //formula: I = (1/12) * m * (h^2 + w^2)
        return inertia;
    }

draw(ctx, strokeColor) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.orientation);

    ctx.fillStyle = this.material.fillColor;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.strokeStyle = strokeColor || this.material.fillColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
}


}