import {Circle} from './circle.js';

export class Collisions {
    constructor() {
<<<<<<< HEAD
=======
        this.possibleCollisions = [];
>>>>>>> 9c4beda83c2b4d5a9cda3b3b6e3fd43639cf261c
        this.collisions = [];
    }

    clearCollisions() {
<<<<<<< HEAD
        this.collisions = [];
    }

    narrowPhazeDetection(objects) {
        for (let i=0; i<objects.length; i++) {
            for (let j=0; j<objects.length; j++) {
                if(j > i) {
                    // detect collisions
                    if(objects[i].shape instanceof Circle && objects[i].shape instanceof Circle) {
                        this.detectCollisionCircleCircle(objects[i], objects[j]);
                    } //later detect rectangles here
=======
        this.possibleCollisions = [];
        this.collisions = [];
    }

    broadPhazeDetection (objects) {
        for(let i=0; i<objects.length; i++) {
            for(let j=i+1; j<objects.length; j++) {
                this.detectAabbCollision(objects[i], objects[j]);
            }
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
>>>>>>> 9c4beda83c2b4d5a9cda3b3b6e3fd43639cf261c
                }
            }
        }
    }

<<<<<<< HEAD
    detectCollisionCircleCircle(o1, o2) {
        const s1 = o1.shape;
        const s2 = o2.shape;
        const dist = s1.position.distanceTo(s2.position);
        if (dist < s1.radius + s2.radius) {
            const overlap = s1.radius + s2.radius - dist;
            const normal = s2.position.clone().subtract(s1.position).normalize();
            this.collsions.push({
                collidedPair: [o1, o2],
=======
    detectAabbCollision(o1, o2) {
        let o1aabb = o1.shape.aabb;
        let o2aabb = o2.shape.aabb;
        if (o1aabb.max.x > o2aabb.min.x &&
            o1aabb.max.y > o2aabb.min.y &&
            o2aabb.max.x > o1aabb.min.x &&
            o2aabb.max.y > o1aabb.min.y) {
            this.possibleCollisions.push([o1, o2]);
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
>>>>>>> 9c4beda83c2b4d5a9cda3b3b6e3fd43639cf261c
                overlap: overlap,
                normal: normal
            })
        }
    }

<<<<<<< HEAD
    pushOffObjects(o1, o2, overlap, normal){
=======
    //detect rectangles collisions

    pushOffObjects(o1, o2, overlap, normal) {
>>>>>>> 9c4beda83c2b4d5a9cda3b3b6e3fd43639cf261c
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