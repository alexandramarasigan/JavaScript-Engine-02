import {Circle} from './circle.js';
import {Rect} from './rect.js';

export class Renderer {
    constructor(canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
    }
    
    drawFrame(objects, fillCol, bordCol) {
        objects.forEach(object => {
            object.shape.draw(this.ctx, bordCol, fillCol);
            // Draw AABB
            object.shape.aabb.draw(this.ctx, "red");
        });
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    
}