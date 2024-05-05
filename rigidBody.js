import {Vec} from './vector.js';
import {Rect} from './rect.js';
import {Material} from './material.js';

export class RigidBody {
    constructor(shape, fixed = false, material = new Material('default', 1, 0.5, 'gray')) {
        this.shape = shape;
        this.fixed = fixed;
        this.material = material;
        this.velocity = new Vec(0, 0);
        this.acceleration = new Vec(0, 0);
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        this.setMass();
		this.inertia = this.shape.calculateInertia(this.mass);
        this.inverseInertia = this.fixed ? 0 : 1 / this.inertia;
    }

    setMass() {
        if (!this.fixed) {
            this.mass = this.shape.calculateMass(this.material.density);
            this.inverseMass = 1 / this.mass;
        } else {
            this.mass = Infinity;
            this.inverseMass = 0;
        }
    }

    calculateInertia() {
        return this.shape.calculateInertia(this.mass); 
    }

    draw(ctx) {
        this.shape.draw(ctx, this.material.color);  // Use color from material for drawing
    }

    updateShape(dt) {
        if (!this.fixed) {
            const dv = this.acceleration.clone().multiply(dt);
            this.velocity.add(dv);
            const ds = this.velocity.clone().multiply(dt);
            this.shape.position.add(ds);
            this.angularVelocity += this.angularAcceleration * dt;
            this.shape.orientation += this.angularVelocity * dt;

            if (this.shape instanceof Rect) {
                this.shape.updateVertices();
            }
            this.shape.updateAabb();
        }
    }

    checkTooFar(worldSize) {
        return this.shape.position.magnitude() > worldSize;
    }

}