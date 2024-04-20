import {Circle} from './circle.js';
import {Rect} from './rect.js';

export class Renderer {
    constructor(canv, ctx) {
        this.canvas = canv;
        this.ctx = ctx;
        this.renderedAlways = [];
        this.renderedNextFrame = [];
        this.texts = [];
    }
    
    drawText(textObject) {
        this.ctx.fillStyle = textObject.color;
        this.ctx.font = textObject.font;
        this.ctx.fillText(textObject.text, textObject.position.x, textObject.position.y);
    }

    drawFrame(objects, fillCol, bordCol) {
        for (let i = 0; i<objects.length; i++) {
            const shape = objects[i].shape;
            shape.draw(this.ctx, fillCol, bordCol);
            // shape.aabb.draw(this.ctx, "red");
        }
        for (let i = 0; i<this.renderedNextFrame.length; i++) {
            this.renderedNextFrame[i].draw(this.ctx, bordCol);   //draw each item from the list
        }
        this.renderedNextFrame = [];    //clear the array, basically means we only draw them once

        for (let i = 0; i<this.renderedAlways.length; i++) {
            this.renderedAlways[i].draw(this.ctx, bordCol);
        }
        this.texts.forEach(text => {
            this.drawText(text);
        });
    }

    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    
}