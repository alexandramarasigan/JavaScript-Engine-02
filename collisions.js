import {Circle} from './circle.js';
import {Rect} from './rect.js'

export class Collisions {
    constructor() {
        this.collisions = [];
    }

    clearCollisions() {
        this.collisions = [];
    }

    narrowPhazeDetection(objects) {
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) { 
                if (objects[i].shape instanceof Rect && objects[j].shape instanceof Rect) {
                    this.detectCollisionRectangleRectangle(objects[i], objects[j]); //try passing object.shape here, or change the method to use rect1.shape etc
                } else if (objects[i].shape instanceof Circle && objects[j].shape instanceof Circle) {
                    this.detectCollisionCircleCircle(objects[i], objects[j]);
                }
            }
        }
    }
    
    detectCollisionCircleCircle(o1, o2) {   //o1 and o2 are rigidBodies from array objects in main
        const s1 = o1.shape;    //rigidBodies have shape circle or rectangle
        const s2 = o2.shape;    //shape has position and radius
        const dist = s1.position.distanceTo(s2.position);
        if (dist < s1.radius + s2.radius) {
            const overlap = s1.radius + s2.radius - dist;
            //unit vector from s1 to s2
            const normal = s2.position.clone().subtract(s1.position).normalize();   //unit vector(direction) normal(perpendicular) to contact surface
            this.collisions.push({  //object
                collidedPair: [o1, o2], //[array]
                overlap: overlap,
                normal: normal
            })
        }
    }

    detectCollisionRectangleRectangle(rect1, rect2) {
        const rect1Left = rect1.position.x - rect1.width / 2;
        const rect1Right = rect1.position.x + rect1.width / 2;
        const rect1Top = rect1.position.y - rect1.height / 2;
        const rect1Bottom = rect1.position.y + rect1.height / 2;
    
        const rect2Left = rect2.position.x - rect2.width / 2;
        const rect2Right = rect2.position.x + rect2.width / 2;
        const rect2Top = rect2.position.y - rect2.height / 2;
        const rect2Bottom = rect2.position.y + rect2.height / 2;
    
        if (rect1Right >= rect2Left && rect1Left <= rect2Right && rect1Bottom >= rect2Top && rect1Top <= rect2Bottom) {
            console.log(true);
        }
    }    

    //detect rectangles collisions

    pushOffObjects(o1, o2, overlap, normal) {
        o1.shape.position.subtract(normal.clone().multiply(overlap/2));
        o2.shape.position.add(normal.clone().multiply(overlap/2));
    }

    resolveCollisions() {
        let collidedPair, overlap, normal, o1, o2;
        for(let i=0; i<this.collisions.length; i++) {
            ({collidedPair, overlap, normal} = this.collisions[i]);
            [o1, o2] = collidedPair;
            this.pushOffObjects(o1, o2, overlap, normal);
        }
    }
}