import {Circle} from './circle.js';
import {Rect} from './rect.js';
import {renderer} from './main.js';

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
        for (let i=0; i<objects.length; i++) {
            for (let j=0; j<objects.length; j++) {  //try j=i+1
                if(j > i) {
                    //detect collisions
                    if(objects[i].shape instanceof Circle && 
                        objects[j].shape instanceof Circle) {
                        this.detectCollisionCircleCircle(objects[i], objects[j]);
                    }   //later detect rectangle rectangle here
                    else if (objects[i].shape instanceof Circle && 
                        objects[j].shape instanceof Rect) {
                            this.findClosestVertex(objects[j].shape.vertices, objects[i].shape.position);
                    }
                    else if (objects[i].shape instanceof Rect && 
                        objects[j].shape instanceof Circle) {
                            this.findClosestVertex(objects[i].shape.vertices, objects[j].shape.position);
                    }
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

    //detect rectangles collisions
    detectCollisionCirclePolygon (c, p) {
        const vertices = p.shape.vertices;
        const cShape = c.shape;
        let overlap, normal, axis;

        overlap = Number.MAX_VALUE;

        for (let i = 0; i < vertices.length; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i+1)%vertices.length];
            axis = v2.clone().subtract(v1).rotateCCW90().normalize();
            const [min1, max1] = this.projectVertices(vertices, axis);
            const [min2, max2] = this.projectCircle(center, radius, axis);
            
            if (min2 >= max1 || min1 >= max2){
                //we dont have collision
                return;
            }

            const axisOverlap = Math.min(max2-min1, max1-min2); //finds smallest overlap
            if (overlap >= axisOverlap) {
                overlap = axisOverlap;
            }
        }
    }

    projectVertices (vertices, axis) {
        let min, max;
        min = vertices[0].dot(axis);    //first vertex projection
        max = min;  //save it as both min and max

        for (let i = 1; i < vertices.length; i++) {
            const proj = vertices[i].dot(axis); //projections for all other vertices
            if (proj < min) {
                min = proj;
            }
            if (proj > max) {
                max = proj;
            }
        }

        return [min, max];  //smallest and largest projection
    }

    projectCircle (center, radius, axis) {
        let min, max;
        //points on circle distance 1 radius from center
        const points = [center.clone().moveDistInDir(radius, axis), center.clone().moveDistInDir(-radius, axis)];
        
        min = points[0].dot(axis);  //project points
        max = points[1].dot(axis);
        
        if (min > max) {    //swap min and max if we chose wrong
            const t = min;
            min = max;
            max = t;
        }

        return [min, max];
    }

    findClosestVertex (vertices, center) {  //returns the i of the closest of vertices to a center point
        let minDist = Number.MAX_VALUE;
        let vertexDist, closestVertex;
        for (let i=0; i<vertices.length; i++) {
            vertexDist = vertices[i].distanceTo(center);
            if (vertexDist < minDist) {
                minDist = vertexDist;
                closestVertex = vertices[i];
            }
        }
        renderer.renderedNextFrame.push(closestVertex);
        return closestVertex;
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