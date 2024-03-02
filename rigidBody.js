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
<<<<<<< HEAD

		this.shape.orientation += this.angularVelocity * dt;

=======
		this.shape.orientation += this.angularVelocity * dt;
		//here I update the position and orientation first, then update the aabb
>>>>>>> 64fcd8b551ee92658e03cc10dda2d109d4091289
		if (this.shape.updateAabb) {
    this.shape.updateAabb();
        }
<<<<<<< HEAD


		//update vertices and aabb of shape if it is rectangle
=======
>>>>>>> 64fcd8b551ee92658e03cc10dda2d109d4091289
    } 

}