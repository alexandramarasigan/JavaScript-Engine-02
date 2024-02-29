import {Circle} from './circle.js';

export class Collisions {
    constructor() {
        this.collisions = [];
        this.possibleCollisions = [];
    }

    clearCollisions() {
        this.collisions = [];
    }

    broadPhaseDetection(objects) {
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                if (this.detectAabbCollision(objects[i].shape.aabb, objects[j].shape.aabb)) {
                    console.log("AABB collision detected");
                    this.narrowPhaseDetection(objects[i], objects[j]);
                }
            }
        }
    }

    detectAabbCollision(aabb1, aabb2) {
        const isSeparatedOnX = aabb1.max.x < aabb2.min.x || aabb2.max.x < aabb1.min.x;
        const isSeparatedOnY = aabb1.max.y < aabb2.min.y || aabb2.max.y < aabb1.min.y;

        if (!isSeparatedOnX && !isSeparatedOnY) {
            return true;
        } else {
            return false;
        }
    }

    narrowPhazeDetection(objects) {
        for (let i=0; i<objects.length; i++) {
            for (let j=0; j<objects.length; j++) {  //try j=i+1
                if(j > i) {
                    //detect collisions
                    if(objects[i].shape instanceof Circle && 
                        objects[j].shape instanceof Circle) {
                        this.detectCollisionCircleCircle(objects[i], objects[j]);
                    }   //later detect rectangle rectangle here
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