import { RigidBody } from './rigidBody.js';

export class Circle extends RigidBody {   //also you could do extends RigidBody
    constructor(pos, r) {
        super({position: pos, radius: r});
        this.position = pos;
        this.radius = r;
    }
}