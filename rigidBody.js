import {Vec} from './vector.js';
import {Rect} from './rect.js';

export class RigidBody {
	constructor(shape, fixed=false) {
		this.shape = shape;   
		this.velocity = new Vec(0, 0);

		this.angularVelocity = 0;
		this.angularAcceleration = 0;

		this.mass;
		this.inverseMass;
		this.density = 1;

		this.inertia;
		this.inverseInertia;

		this.isFixed = fixed;

		this.acceleration = new Vec(0, 0);
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
		this.mass = this.shape.calculateMass(this.density);
		this.inertia = this.shape.calculateInertia(this.mass);

		if (this.isFixed) {
			this.inverseMass = 0;	//0 for collisions means that the mass is infinity
			this.inverseInertia = 0;
		} else {
			this.inverseMass = 1 / this.mass;
			this.inverseInertia = 1 / this.inertia;
		}
	}

	checkTooFar (worldSize) {
		if (this.shape.position.magnitude() > worldSize) {
			return true;
		}
	}

}