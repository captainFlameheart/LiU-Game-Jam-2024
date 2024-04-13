class Body {
    physicsEngine: PhysicsEngine;
    
    position: Vector2D;
    velocity: Vector2D;
    acceleration: Vector2D;
    lightness: number;

    angle: number;
    angularVelocity: number;
    angularAcceleration: number;
    angularLightness: number;

    polygons: PhysicalPolygon[];
    
    constructor(
        physicsEngine: PhysicsEngine, 
        position: Vector2D, 
        velocity: Vector2D, 
        acceleration: Vector2D, 
        lightness: number, 
        angle: number, 
        angularVelocity: number, 
        angularAcceleration: number, 
        angularLightness: number, 
        polygons: PhysicalPolygon[]
    ) {
        this.physicsEngine = physicsEngine;
    
        this.position = position;
        this.velocity = velocity;
        this.acceleration = acceleration;
        this.lightness = lightness;

        this.angle = angle;
        this.angularVelocity = angularVelocity;
        this.angularAcceleration = angularAcceleration;
        this.angularLightness = angularLightness;
        
        this.polygons = polygons;
    }

    static of(physicsEngine: PhysicsEngine) {
        const position = Vector2D.zero();
        const velocity = Vector2D.zero();
        const acceleration = Vector2D.zero();
        const lightness = 1.0;
        
        const angle = 0.0;
        const angularVelocity = 0.0;
        const angularAcceleration = 0.0;
        const angularLightness = 1.0;

        const polygons: PhysicalPolygon[] = [];

        return new Body(
            physicsEngine, 
            position, velocity, acceleration, lightness, 
            angle, angularVelocity, angularAcceleration, angularLightness, 
            polygons
        );
    }

    globalPointToDisplacement(globalPoint: Vector2D) {
        return Vector2D.subtract(globalPoint, this.position);
    }

    computeDisplacedVelocity(displacement: Vector2D) {
		return Vector2D.add(
			this.velocity, 
			Vector2D.zCross(this.angularVelocity, displacement), 
		);
	}

    computeDisplacedLightnessInDirection(
        displacement: Vector2D, direction: Vector2D
    ) {
		const cross = Vector2D.cross(displacement, direction);
        return this.lightness + this.angularLightness * cross * cross;
	}

	computeDisplacedLightnessOrthogonalToDirection(
        displacement: Vector2D, direction: Vector2D
    ) {
		const dot = Vector2D.dot(displacement, direction);
		return this.lightness + this.angularLightness * dot * dot;
	}

    computeDisplacedMassInDirection(
        displacement: Vector2D, direction: Vector2D
    ) {
        const lightness = this.computeDisplacedLightnessInDirection(
            displacement, direction
        );
        return (lightness === 0 ? 0 : 1 / lightness);
    }

    computeDisplacedMassOrthogonalToDirection(
        displacement: Vector2D, direction: Vector2D
    ) {
        const lightness = this.computeDisplacedLightnessOrthogonalToDirection(
            displacement, direction
        );
        return (lightness === 0 ? 0 : 1 / lightness);
    }

    setTrueVelocity(trueVelocity: Vector2D) {
        this.velocity.set(Vector2D.multiply(
            trueVelocity, this.physicsEngine.deltaTime
        ));
    }

    setTrueAngularVelocity(trueAngularVelocity: number) {
        this.angularVelocity =
            trueAngularVelocity* this.physicsEngine.deltaTime;
    }

    setTrueAcceleration(trueAcceleration: Vector2D) {
        console.log(this.physicsEngine.deltaTime);
        const deltaTime = this.physicsEngine.deltaTime;
        this.acceleration.set(Vector2D.multiply(
            trueAcceleration, deltaTime * deltaTime
        ));
    }


        // Corresponding getters
        getTrueVelocity(): Vector2D {
            return Vector2D.divide(this.velocity, this.physicsEngine.deltaTime);
        }
    
        getTrueAngularVelocity(): number {
            return this.angularVelocity / this.physicsEngine.deltaTime;
        }
    
        getTrueAcceleration(): Vector2D {
            const deltaTime = this.physicsEngine.deltaTime;
            return Vector2D.divide(this.acceleration, deltaTime * deltaTime);
        }

    applyForce(trueForce: Vector2D){
        const deltaTime = this.physicsEngine.deltaTime
        this.acceleration.addMultiplied(trueForce,deltaTime*deltaTime*this.lightness)

    }
    applyTorqe(trueTorqe:  number){
        const deltaTime = this.physicsEngine.deltaTime
        this.angularAcceleration += trueTorqe,deltaTime*deltaTime*this.angularAcceleration
    }
    
    applyTureImpulse(trueImpulse: Vector2D){
        const deltaTime = this.physicsEngine.deltaTime
        this.velocity.addMultiplied(trueImpulse,deltaTime*this.lightness)

    }


    applyDisplacedImpulseInDirection(
        displacement: Vector2D, direction: Vector2D, scalar: number
    ) {
		this.velocity.addMultiplied(direction, scalar * this.lightness);
		const angularImpulse = scalar * Vector2D.cross(displacement, direction);
		this.angularVelocity += angularImpulse * this.angularLightness;
	}

	applyDisplacedImpulseOrthogonalToDirection(
        displacement: Vector2D, direction: Vector2D, scalar: number
    ) {
		this.velocity.addZCross(scalar * this.lightness, direction);
		const angularImpulse = scalar * Vector2D.dot(displacement, direction);
		this.angularVelocity += angularImpulse * this.angularLightness;
	}

    applyDisplacedPositionImpulseInDirection(
        displacement: Vector2D, direction: Vector2D, scale: number
    ) {
		this.position.addMultiplied(direction, scale * this.lightness);
		const angularPositionImpulse = 
			scale * Vector2D.cross(displacement, direction);
		this.angle += angularPositionImpulse * this.angularLightness;
	}

	applyDisplacedPositionImpulseOrthogonalToDirection(
		displacement: Vector2D, direction: Vector2D, scale: number
	) {
		this.position.addZCross(scale * this.lightness, direction);
		const angularPositionImpulse = 
			scale * Vector2D.dot(displacement, direction);
		this.angle += angularPositionImpulse * this.angularLightness;
	}

    integrateAcceleration() {
        this.velocity.add(this.acceleration);
        this.angularVelocity += this.angularAcceleration;
    }

    integrateVelocity() {
        this.position.add(this.velocity);
        this.angle += this.angularVelocity;
    }

    updatePolygon(polygon: number) {
        this.polygons[polygon].convexPolygon.transform(this);
    }

    updateShapes() {
        for (let i = 0; i < this.polygons.length; i++) {
            this.updatePolygon(i);
        }
    }
}