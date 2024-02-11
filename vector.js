export class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    //chainable methods
    copy(v) {   //make this vector have the same coords as another vec
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    add(v) {    //add v's x and y to this vector's x y and return the new vector
        this.x += v.x;  //operators
        this.y += v.y;  
        return this;    //used for chaining methods
    }

    subtract(v) {    //add v's x and y to this vector's x y and return the new vector
        this.x -= v.x;  //operators
        this.y -= v.y;  
        return this;    //used for chaining methods
    }

    multiply(s) {   //multiply by a scalar
        this.x *= s;
        this.y *= s;
        return this;
    }

    divide(s) {   //divide vector by a scalar
        this.x /= s;
        this.y /= s;
        return this;
    }

    absolute() {
		this.x = Math.abs(this.x);  //makes absolute or positive values
		this.y = Math.abs(this.y);
		return this;
	}

    normalize() {
        const length = this.magnitude();
        if(length > 0) {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }

    //non-chainable methods
    clone() {   //create a new vector with the same coordinates
        return new Vec(this.x, this.y);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distanceTo (v) {
		return this.clone().subtract(v).magnitude();
	}
}