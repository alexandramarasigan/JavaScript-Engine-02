import {Circle} from './circle.js';
import {Rect} from './rect.js';

export class Renderer {
    constructor(canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
        this.renderedAlways = [];
        this.renderedNextFrame = [];
    }
    
    drawFrame(objects, fillCol, bordCol) {
        for (let i = 0; i<objects.length; i++) {
            const shape = objects[i].shape;
            shape.draw(this.ctx, fillCol, bordCol);
            shape.aabb.draw(this.ctx, "red");
        }
        for (let i = 0; i<this.renderedNextFrame.length; i++) {
            this.renderedNextFrame[i].draw(this.ctx, bordCol);   //draw each item from the list
        }
        this.renderedNextFrame = [];    //clear the array, basically means we only draw them once

        for (let i = 0; i<this.renderedAlways.length; i++) {
            this.renderedAlways[i].draw(this.ctx, bordCol);
        }

    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    
}