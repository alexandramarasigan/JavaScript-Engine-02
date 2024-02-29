import {Vec} from './vector.js';

export class RigidBody {
	constructor(shape) {
		this.shape = shape;   
		this.velocity = new Vec(0, 0);

		this.angularVelocity = 2;
	}	

	updateShape(dt) {
		const ds = this.velocity.clone().multiply(dt);  //multiply v * dt = giving you displacement per frame
		this.shape.position.add(ds);
		this.shape.orientation += this.angularVelocity * dt;
		//here I update the position and orientation first, then update the aabb
		if (this.shape.updateAabb) {
            this.shape.updateAabb();
        }
    } 

}