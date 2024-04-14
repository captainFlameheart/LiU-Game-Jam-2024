class RevoluteJoint implements Constraint {
    body0: Body;
    localAnchor0: Vector2D;
    body1: Body;
    localAnchor1: Vector2D;
    referenceAngle: number;
    lowerAngle: number;
    upperAngle: number;

    impulse: Vector2D;
    lowerImpulse: number;
    upperImpulse: number;

    displacement0: Vector2D;
    displacement1: Vector2D;
    lightness: Matrix2By2;
    angle: number;
    angularMass: number;

    constructor(
        body0: Body, localAnchor0: Vector2D, 
        body1: Body, localAnchor1: Vector2D, 
        referenceAngle: number, lowerAngle: number, upperAngle: number, 
        impulse: Vector2D, 
        lowerImpulse: number, upperImpulse: number, 
        displacement0: Vector2D, displacement1: Vector2D, 
        lightness: Matrix2By2,  
        angle: number, 
        angularLightness: number
    ) {
        this.body0 = body0;
        this.localAnchor0 = localAnchor0;
        this.body1 = body1;
        this.localAnchor1 = localAnchor1;
        this.referenceAngle = referenceAngle;
        this.lowerAngle = lowerAngle;
        this.upperAngle = upperAngle;
        this.impulse = impulse;
        this.lowerImpulse = lowerImpulse;
        this.upperImpulse = upperImpulse;
        this.displacement0 = displacement0;
        this.displacement1 = displacement1;
        this.lightness = lightness;
        this.angle = angle;
        this.angularMass = angularLightness;
    }

    static of(
        body0: Body, localAnchor0: Vector2D, 
        body1: Body, localAnchor1: Vector2D, 
        lowerAngle: number, upperAngle: number
    ) {
        const referenceAngle = 0;

        const impulse = Vector2D.zero();
        const lowerImpulse = 0;
        const upperImpulse = 0;

        const lightness = new Matrix2By2(0, 0, 0, 0);
        const displacement0 = Vector2D.zero();
        const displacement1 = Vector2D.zero();
        const angle = 0;
        const angleMass = 0;

        return new RevoluteJoint(
            body0, localAnchor0, 
            body1, localAnchor1, 
            referenceAngle, lowerAngle, upperAngle, impulse, lowerImpulse, upperImpulse, 
            displacement0, displacement1, lightness, 
            angle, angleMass
        );
    }

    initializeVelocityConstraint(physicsEngine: PhysicsEngine) {
        this.displacement0 = this.body0.localToDisplacement(this.localAnchor0);
        this.displacement1 = this.body1.localToDisplacement(this.localAnchor1);

        // J = [-I -r1_skew I r2_skew]
        // r_skew = [-ry; rx]

        // Matlab
        // K = [ mA+r1y^2*iA+mB+r2y^2*iB,  -r1y*iA*r1x-r2y*iB*r2x]
        //     [  -r1y*iA*r1x-r2y*iB*r2x, mA+r1x^2*iA+mB+r2x^2*iB]

        const m_rA = this.displacement0;
        const m_rB = this.displacement1;
        const mA = this.body0.lightness, mB = this.body1.lightness;
        const iA = this.body0.angularLightness, iB = this.body1.angularLightness;

        this.lightness.column0.x = mA + mB + m_rA.y * m_rA.y * iA + m_rB.y * m_rB.y * iB;
        this.lightness.column1.x = -m_rA.y * m_rA.x * iA - m_rB.y * m_rB.x * iB;
        this.lightness.column0.y = this.lightness.column1.x;
        this.lightness.column1.y = mA + mB + m_rA.x * m_rA.x * iA + m_rB.x * m_rB.x * iB;

        this.angularMass = iA + iB;
        if (this.angularMass > 0)
        {
            this.angularMass = 1 / this.angularMass;
        }

        this.angle = this.body1.angle - this.body0.angle - this.referenceAngle;

        this.impulse.multiply(physicsEngine.warmStarting);
        this.lowerImpulse *= physicsEngine.warmStarting;
        this.upperImpulse *= physicsEngine.warmStarting;

        const angularImpulse = this.lowerImpulse - this.upperImpulse;

        this.body0.velocity.addMultiplied(this.impulse, -mA);
        this.body0.angularVelocity -= iA * (
            Vector2D.cross(m_rA, this.impulse) + angularImpulse
        );

        this.body1.velocity.addMultiplied(this.impulse, mB);
        this.body1.angularVelocity += iB * (
            Vector2D.cross(m_rB, this.impulse) + angularImpulse
        );
    }

    constrainVelocity(physicsEngine: PhysicsEngine) {
        const mA = this.body0.lightness;
        const mB = this.body1.lightness;
        const iA = this.body0.angularLightness;
        const iB = this.body1.angularLightness;

        // Lower limit
        {
            const angle = this.angle - this.lowerAngle;
            const angularVelocity = this.body1.angularVelocity - this.body0.angularVelocity;
            let impulse = -this.angularMass * (
                angularVelocity + Math.max(angle, 0) / physicsEngine.deltaTime
            );
            const oldImpulse = this.lowerImpulse;
            this.lowerImpulse = Math.max(this.lowerImpulse + impulse, 0.0);
            impulse = this.lowerImpulse - oldImpulse;

            this.body0.angularVelocity -= iA * impulse;
            this.body1.angularVelocity += iB * impulse;
        }

            // Upper limit
            // Note: signs are flipped to keep C positive when the constraint is satisfied.
            // This also keeps the impulse positive when the limit is active.
            {
                const angle = this.upperAngle - this.angle;
                const angularVelocity = 
                    this.body0.angularVelocity - this.body1.angularVelocity;
                let impulse = -this.angularMass * (
                    angularVelocity + Math.max(angle, 0) / physicsEngine.deltaTime
                );
                const oldImpulse = this.upperImpulse;
                this.upperImpulse = Math.max(this.upperImpulse + impulse, 0);
                impulse = this.upperImpulse - oldImpulse;

                this.body0.angularVelocity += iA * impulse;
                this.body1.angularVelocity -= iB * impulse;
            }

        // Solve point-to-point constraint
        {
            const velocity = Vector2D.subtract(
                this.body1.computeDisplacedVelocity(this.displacement1), 
                this.body0.computeDisplacedVelocity(this.displacement0)
            );
            const impulse = this.lightness.solve(Vector2D.negate(velocity));

            this.impulse.add(impulse);

            this.body0.velocity.addMultiplied(impulse, -this.body0.lightness);
            this.body0.angularVelocity -= this.body0.angularLightness * 
                Vector2D.cross(this.displacement0, impulse);

            this.body1.velocity.addMultiplied(impulse, this.body1.lightness);
            this.body1.angularVelocity += this.body1.angularLightness * 
                Vector2D.cross(this.displacement1, impulse);
        }
    }

    constrainPosition(physicsEngine: PhysicsEngine) {
        const angle = this.body1.angle - this.body0.angle - this.referenceAngle;
        let C = 0;

        const angularSlop = 0.1;
        if (angle <= this.lowerAngle) {
            C = Math.min(angle - this.lowerAngle + angularSlop, 0);
        }
        else if (angle >= this.upperAngle)
        {
            C = Math.max(angle - this.upperAngle - angularSlop, 0);
        }

        const limitImpulse = -this.angularMass * C;
        this.body0.angle -= this.body0.lightness * limitImpulse;
        this.body1.angle += this.body1.lightness * limitImpulse;

        // Solve point-to-point constraint.
        {
            this.displacement0 = this.body0.localToDisplacement(this.localAnchor0);
            this.displacement1 = this.body1.localToDisplacement(this.localAnchor1);
            
            const C = Vector2D.subtract(
                Vector2D.add(this.body1.position, this.displacement1), 
                Vector2D.add(this.body0.position, this.displacement0)
            );

            const rA = this.displacement0;
            const rB = this.displacement1;
            const mA = this.body0.lightness;
            const mB = this.body1.lightness;
            const iA = this.body0.angularLightness;
            const iB = this.body1.angularLightness;

            this.lightness.column0.x = mA + mB + iA * rA.y * rA.y + iB * rB.y * rB.y;
            this.lightness.column0.y = -iA * rA.x * rA.y - iB * rB.x * rB.y;
            this.lightness.column1.x = this.lightness.column0.y;
            this.lightness.column1.y = mA + mB + iA * rA.x * rA.x + iB * rB.x * rB.x;

            const impulse: Vector2D = Vector2D.negate(this.lightness.solve(C));

            this.body0.position.addMultiplied(impulse, -mA);
            this.body0.angle -= iA * Vector2D.cross(rA, impulse);

            this.body1.position.addMultiplied(impulse, mB);
            this.body1.angle += iB * Vector2D.cross(rB, impulse);
        }
    }
}