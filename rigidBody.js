import {Vec} from './vector.js';
import {Rect} from './rect.js';
import {Material} from './Material.js';

export class RigidBody {
    constructor(shape, fixed = false, material = new Material('default', 1, 0.5, 'gray')) {
        this.shape = shape;
        this.fixed = fixed;
        this.material = material;
        this.velocity = new Vec(0, 0);
        this.acceleration = new Vec(0, 0);
        this.setMass();
    }

	updateShape(dt) {
		const dv = this.acceleration.clone().multiply(dt);
		this.velocity.add(dv);
		const ds = this.velocity.clone().multiply(dt);  //multiply v * dt = giving you displacement per frame
		this.shape.position.add(ds);

		this.angularVelocity += this.angularAcceleration * dt;
		this.shape.orientation += this.angularVelocity * dt;

		//update vertices and aabb of shape if it is rectangle
		if (this.shape instanceof Rect) {
			this.shape.updateVertices();
		}
		//update aabb
		this.shape.updateAabb();
    } 

    setMass() {
        this.mass = this.shape.calculateMass(this.material.density);
        this.inverseMass = this.fixed ? 0 : 1 / this.mass;
        this.inertia = this.shape.calculateInertia(this.mass);
        this.inverseInertia = this.fixed ? 0 : 1 / this.inertia;
    }

	draw(ctx) {
        this.shape.draw(ctx, this.material.color);  // Use color from material for drawing
    }

	checkTooFar (worldSize) {
		if (this.shape.position.magnitude() > worldSize) {
			return true;
		}
	}

}