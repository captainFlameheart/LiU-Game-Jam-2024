class Vector2D {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static copy(vector: Vector2D) {
        return new Vector2D(vector.x, vector.y);
    }

    static cartesian(x: number, y: number) {
        return new Vector2D(x, y);
    }

    static zero() {
        return new Vector2D(0, 0);
    }

    static negate(vector: Vector2D) {
        return new Vector2D(-vector.x, -vector.y);
    }

    static halve(vector: Vector2D) {
        return new Vector2D(0.5 * vector.x, 0.5 * vector.y);
    }

    static add(vector0: Vector2D, vector1: Vector2D) {
        return new Vector2D(vector0.x + vector1.x, vector0.y + vector1.y);
    }

    static addMultiplied(vector0: Vector2D, vector1: Vector2D, scalar: number) {
        return new Vector2D(
            vector0.x + vector1.x * scalar, vector0.y + vector1.y * scalar
        );
    }

    static subtract(vector0: Vector2D, vector1: Vector2D) {
        return new Vector2D(vector0.x - vector1.x, vector0.y - vector1.y);
    }

    static multiply(vector: Vector2D, scalar: number) {
        return new Vector2D(vector.x * scalar, vector.y * scalar);
    }

    static divide(vector: Vector2D, scalar: number) {
        return new Vector2D(vector.x / scalar, vector.y / scalar);
    }



    static fromPolar(angle: number, radius: number): Vector2D {
        return new Vector2D(radius * Math.cos(angle), radius * Math.sin(angle));
    }
    
    static perpendicularCounterClockwise(vector: Vector2D) {
		return new Vector2D(
			-vector.y, 
			vector.x
		);
	}

    // Static method to create a vector from one point (from) to another point (to)
    static fromPoints(from: Vector2D, to: Vector2D): Vector2D {
        return new Vector2D(to.x - from.x, to.y - from.y);
            }

    static perpendicularClockwise(vector: Vector2D) {
        return new Vector2D(
            vector.y, 
            -vector.x
        );
    }
    
    static rotate(vector: Vector2D, angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            vector.x * cos - vector.y * sin, 
            vector.x * sin + vector.y * cos
        );
    }

    static dot(vector0: Vector2D, vector1: Vector2D) {
		return vector0.x * vector1.x + vector0.y * vector1.y;
	}

    static cross(vector0: Vector2D, vector1: Vector2D) {
        return vector0.x * vector1.y - vector1.x * vector0.y;
    }

    static zCross(z: number, vector: Vector2D) {
		return new Vector2D(
			-vector.y * z, 
			vector.x * z
		);
	}

    static computeSquareDistance(point0: Vector2D, point1: Vector2D) {
        return Vector2D.subtract(point1, point0).getSquareLength();
    }

    static computeDistance(point0: Vector2D, point1: Vector2D) {
        return Vector2D.subtract(point1, point0).getLength();
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    getSquareLength(): number {
        return this.x * this.x + this.y * this.y;
    }

    getLength(): number {
        return Math.sqrt(this.getSquareLength());
    }

    computeAspectRatio(): number {
        return this.x / this.y;
    }

    set(vector: Vector2D) {
        this.x = vector.x;
        this.y = vector.y;
    }

    setX(x: number) {
        this.x = x;
    }
    
    setY(y: number) {
        this.y = y;
    }
    
    add(vector: Vector2D) {
        this.x += vector.x;
        this.y += vector.y;
    }

    addMultiplied(vector: Vector2D, scalar: number) {
        this.x += vector.x * scalar;
        this.y += vector.y * scalar;
    }

    addZCross(z: number, vector: Vector2D) {
		this.x -= vector.y * z;
		this.y += vector.x * z
	}

    multiply(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    clampToZeroIfLengthLessThan(threshold: number) {
        if (this.getLength() < threshold) {
            this.x = 0;
            this.y = 0;
        }
    }

    makePerpendicularClockwise() {
        const oldX = this.x;
        this.x = this.y; 
        this.y = -oldX;
    }

    normalize() {
        
        const length = this.getLength();
        if (length !== 0){

        const scalar = 1 / length;
        this.x *= scalar;
        this.y *= scalar;
        
        }
    }
}