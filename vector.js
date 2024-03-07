export class Vec {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.renderOrigin;
	}
    //chainable methods
	copy (v) {	//copy the xy of another vector into this
		this.x = v.x;
		this.y = v.y;
		return this;
	}
	
	setX (x) {
		this.x = x;
		return this;
	}

	setY (y) {
		this.y = y;
		return this;
	}

	add (v) {		//add a vector to this
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	addX (x) {	//scalar addition
		this.x += x;
		return this;
	}
	
	addY (y) {	//scalar addition
		this.y += y;
		return this;
	}
	
	subtract (v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	subtractX (x) {
		this.x -= x;
		return this;
	}

	subtractY (y) {
		this.y -= y;
		return this;
	}
	
	multiply (s) {
		this.x *= s;
		this.y *= s;
		return this;
	}
	
	divide (s) {
		this.x /= s;
		this.y /= s;
		return this;
	}

	absolute() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}

<<<<<<< HEAD
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
=======
	normalize() {
		const length = this.magnitude();
		if(length > 0) {
			this.x /= length;
			this.y /= length;
		}
		return this;
	}
>>>>>>> 9c4beda83c2b4d5a9cda3b3b6e3fd43639cf261c

	rotate(angle) {	//in formula angle is Theta
		const x = this.x;	//Ax
		const y = this.y;
		this.x = x * Math.cos(angle) - y * Math.sin(angle);	//Bx
		this.y = x * Math.sin(angle) + y * Math.cos(angle);
		return this;
	}
	
	//non-chainable
	clone () {	//create a new vector with xy of this
		return new Vec(this.x, this.y);
	}

    magnitude () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	distanceTo (v) {
		return this.clone().subtract(v).magnitude();
	}

	draw(ctx, strokeColor) {
		if (this.color) {
			ctx.strokeStyle = this.color;
		} else {
			ctx.strokeStyle = strokeColor;
		}
        ctx.lineWidth = 3;
		const renderEnd = this.renderOrigin.clone().add(this);
		//line from vector tail to vector head
		ctx.beginPath();
		ctx.moveTo(this.renderOrigin.x, this.renderOrigin.y);
		ctx.lineTo(renderEnd.x, renderEnd.y);

		ctx.stroke();

		//circle at vector head
		ctx.beginPath();
        ctx.arc(renderEnd.x, renderEnd.y, 5, 0, Math.PI*2, true);	//radius 5
        ctx.closePath();
        
        ctx.stroke();
	}
}
