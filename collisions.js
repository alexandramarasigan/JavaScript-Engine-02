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
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                if (objects[i].shape instanceof Circle && objects[j].shape instanceof Rect) {
                    this.detectCollisionCirclePolygon(objects[i], objects[j]);
                } else if (objects[i].shape instanceof Rect && objects[j].shape instanceof Circle) {
                    this.detectCollisionCirclePolygon(objects[j], objects[i]); // Swap to maintain order
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

    detectCollisionCirclePolygon(c, p) {
        const vertices = p.shape.vertices;
        const cShape = c.shape;
    
        let smallestOverlap = Number.MAX_VALUE;
        let collisionNormal = null;
        
        //insert code from class for testing edges collisions
        let axis;
        for (let i=0; i<vertices.length; i++) {
            const v1 = vertices[i];
            const v2 = vertices[(i+1)%vertices.length]; //go clockwise to find pairs of vertices
            axis = v2.clone().subtract(v1).rotateCCW90().normalize(); //rotate an edge 90 degrees CCW to get normal axis
            //find min and max projections on this axis
            const [min1, max1] = this.projectVertices(vertices, axis);
            const [min2, max2] = this.projectCircle(cShape.position, cShape.radius, axis);
            if (min1 >= max2 || min2 >= max1) {
                return;
            }

            const axisOverlap = Math.min(max2-min1, max1-min2); //find on which axis we have the smallest overlap
            if (axisOverlap < smallestOverlap) {
                smallestOverlap = axisOverlap;
                collisionNormal = axis;
            }
        }

        const closestVertex = this.findClosestVertex(vertices, cShape.position);
    
        axis = closestVertex.clone().subtract(cShape.position).normalize();
        let [min1, max1] = this.projectVertices(vertices, axis);
        let [min2, max2] = this.projectCircle(cShape.position, cShape.radius, axis);
    
        let axisOverlap = Math.min(max2 - min1, max1 - min2);
        if (min1 >= max2 || min2 >= max1) { //this means there is no collision on this axis
            return; 
        }
        if (axisOverlap < smallestOverlap) {
            smallestOverlap = axisOverlap;
            collisionNormal = axis;
        }
    
        const vec1to2 = p.shape.position.clone().subtract(cShape.position);
        if (collisionNormal && collisionNormal.dot(vec1to2) < 0) {
            collisionNormal.invert();
        }

        if (smallestOverlap < Number.MAX_VALUE) {
            this.collisions.push({
                collidedPair: [c, p],
                overlap: smallestOverlap,
                normal: collisionNormal
            });
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

    findClosestVertex (vertices, center) {  
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
        const correction = normal.clone().multiply(overlap / 2);
        
        o1.shape.position.subtract(correction);
        o2.shape.position.add(correction);
    }
    

    resolveCollisions() {
        this.collisions.forEach(collision => {
            const { collidedPair, overlap, normal } = collision;
            const [o1, o2] = collidedPair;
            this.pushOffObjects(o1, o2, overlap, normal);
        });
    }
    
}