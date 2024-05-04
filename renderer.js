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
    
    clearFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFrame(objects, fillCol, bordCol) {
        this.clearFrame(); 
        objects.forEach(object => {
            object.draw(this.ctx); 
        });

        this.renderedNextFrame.forEach(item => {
            item.draw(this.ctx, bordCol); 
        });
        this.renderedNextFrame = []; 

        this.renderedAlways.forEach(item => {
            item.draw(this.ctx, bordCol); 
        });

        this.texts.forEach(text => {
            this.drawText(text);
        });
    }

    drawText(textObject) {
        this.ctx.fillStyle = textObject.color;
        this.ctx.font = textObject.font;
        this.ctx.fillText(textObject.text, textObject.position.x, textObject.position.y);
    }

    
}