import {Circle} from './circle.js';
import {Rect} from './rect.js';
import { renderer } from './main.js';

export class Collisions {
    constructor() {
        this.possibleCollisions = [];
        this.collisions = [];
    }

    clearCollisions() {
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
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                if (objects[i].shape instanceof Circle && objects[j].shape instanceof Rect) {
                    this.detectCollisionCircleRectangle(objects[i].shape, objects[j].shape);
                } else if (objects[i].shape instanceof Rect && objects[j].shape instanceof Circle) {
                    this.detectCollisionCircleRectangle(objects[j].shape, objects[i].shape);
                }
            }
        }
    }
    

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
                overlap: overlap,
                normal: normal
            })
        }
    }

    detectCollisionCircleRectangle(circle, rect) {
        let closestVertex = null;
        let minDist = Number.MAX_VALUE;
        rect.updateVertices();
        for (let vertex of rect.vertices) {
            let dist = vertex.distanceTo(circle.position);
            if (dist < minDist) {
                minDist = dist;
                closestVertex = vertex;
            }
        }
        if (closestVertex) {
            renderer.drawVertex(closestVertex, "blue");
        }
    }

    //detect rectangles collisions

    findClosestVertex(vertices, center) {
        let minDist = Number.MAX_VALUE;
        let closestVertex = null;

        for (let i = 0; i < vertices.length; i++) {
            let vertexDist = vertices[i].distanceTo(center);
            if (vertexDist < minDist) {
                minDist = vertexDist;
                closestVertex = vertices[i];
            }
        }

        if (closestVertex) {
            renderer.renderedNextFrame.push({
                draw: (ctx, strokeColor) => {
                    ctx.beginPath();
                    ctx.arc(closestVertex.x, closestVertex.y, 5, 0, Math.PI * 2, true);
                    ctx.strokeStyle = strokeColor || "blue";
                    ctx.stroke();
                }
            });
        }
    }

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