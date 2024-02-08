export class Rect extends RigidBody {
	constructor(pos, w, h) {
		super({position: pos, width: w, height: h});
		this.position = pos;
		this.width = w;
		this.height = h;
	}

}