class ContactConstraint {
    contactManifold: ContactManifold;
    contactPointImpulses: ContactPointImpulse[];

    contactPointManifoldExtension: ContactPointManifoldExtension[];
    targetNormalVelocities: number[];
    
    constructor(
        contactManifold: ContactManifold, 
        contactPointImpulses: ContactPointImpulse[], 
        contactPointConstraintPositionData: ContactPointManifoldExtension[], 
        targetOutgoingVelocities: number[], 
    ) {
        this.contactManifold = contactManifold;
        this.contactPointImpulses = contactPointImpulses;
        this.contactPointManifoldExtension = contactPointConstraintPositionData;
        this.targetNormalVelocities = targetOutgoingVelocities;
    }

    static computeContactPointManifoldExtension(
        body0: Body, body1: Body, contactManifold: ContactManifold, 
        contactPointManifoldExtension: ContactPointManifoldExtension[]
    ) {
        const contactPoints = contactManifold.contactPoints;
        for (let i = 0; i < contactPoints.length; i++) {
            const position = contactPoints[i].position;
            const displacement0 = body0.globalPointToDisplacement(position);
            const displacement1 = body1.globalPointToDisplacement(position);
            
            const normalLightness = body0.computeDisplacedLightnessInDirection(
                displacement0, contactManifold.normal
            ) + body1.computeDisplacedLightnessInDirection(
                displacement1, contactManifold.normal
            );
            const normalMass = (normalLightness === 0 ? 0 : 1 / normalLightness);
            
            const tangentLightness = body0.computeDisplacedLightnessOrthogonalToDirection(
                displacement0, contactManifold.normal
            ) + body1.computeDisplacedLightnessOrthogonalToDirection(
                displacement1, contactManifold.normal
            );
            const tangentMass = (tangentLightness === 0 ? 0 : 1 / tangentLightness);

            contactPointManifoldExtension[i] = ContactPointManifoldExtension.of(
                displacement0, displacement1, normalMass, tangentMass
            );
        }
    }

    static of(
        physicsEngine: PhysicsEngine, body0: Body, body1: Body, 
        contactManifold: ContactManifold
    ) {
        const count = contactManifold.contactPoints.length;
        const contactPointImpulses: ContactPointImpulse[] = new Array(
            count
        );
        for (let i = 0; i < count; i++) {
            contactPointImpulses[i] = ContactPointImpulse.zero()
        }

        const contactPointManifoldExtension: ContactPointManifoldExtension[] = new Array(
            count
        );
        this.computeContactPointManifoldExtension(
            body0, body1, contactManifold, contactPointManifoldExtension
        );
        const targetOutgoingVelocities: number[] = [];
        return new ContactConstraint(
            contactManifold, contactPointImpulses, 
            contactPointManifoldExtension, targetOutgoingVelocities
        );
    }

    setContactManifold(
        physicsEngine: PhysicsEngine, body0: Body, body1: Body, 
        contactManifold: ContactManifold
    ) {
        const oldContactPoints = this.contactManifold.contactPoints;
        const oldCount = oldContactPoints.length;
        const newContactPoints = contactManifold.contactPoints;
        const newCount = newContactPoints.length;
        if (oldCount === 1 && newCount === 1) {
            // Keep impulse
        } else if (oldCount === 1 && newCount === 2) {
            const oldContactPoint = oldContactPoints[0].position;
            const oldImpulse = this.contactPointImpulses[0];
            const newContactPoint0 = newContactPoints[0].position;
            const newContactPoint1 = newContactPoints[1].position;

            const distance0 = Vector2D.computeSquareDistance(
                oldContactPoint, newContactPoint0
            );
            const distance1 = Vector2D.computeSquareDistance(
                oldContactPoint, newContactPoint1
            );
            if (distance0 < distance1) {
                this.contactPointImpulses = [
                    oldImpulse, 
                    ContactPointImpulse.zero()
                ];
            } else {
                this.contactPointImpulses = [
                    ContactPointImpulse.zero(), 
                    oldImpulse
                ];
            }
        } else if (oldCount === 2 && newCount === 1) {
            const oldContactPoint0 = oldContactPoints[0].position;
            const oldImpulse0 = this.contactPointImpulses[0];
            const oldContactPoint1 = oldContactPoints[1].position;
            const oldImpulse1 = this.contactPointImpulses[1];
            const newContactPoint = newContactPoints[0].position;

            const distance0 = Vector2D.computeSquareDistance(
                oldContactPoint0, newContactPoint
            );
            const distance1 = Vector2D.computeSquareDistance(
                oldContactPoint1, newContactPoint
            );
            if (distance0 < distance1) {
                this.contactPointImpulses = [oldImpulse0];
            } else {
                this.contactPointImpulses = [oldImpulse1];
            }
        } else if (oldCount === 2 && newCount === 2) {
            const oldContactPoint0 = oldContactPoints[0].position;
            const oldImpulse0 = this.contactPointImpulses[0];
            const oldContactPoint1 = oldContactPoints[1].position;
            const oldImpulse1 = this.contactPointImpulses[1];
            const newContactPoint0 = newContactPoints[0].position;
            const newContactPoint1 = newContactPoints[1].position;

            const distance00 = Vector2D.computeDistance(
                oldContactPoint0, newContactPoint0
            );
            const distance01 = Vector2D.computeDistance(
                oldContactPoint0, newContactPoint1
            );
            const distance10 = Vector2D.computeDistance(
                oldContactPoint1, newContactPoint0
            );
            const distance11 = Vector2D.computeDistance(
                oldContactPoint1, newContactPoint1
            );
            if (distance01 + distance10 < distance00 + distance11) {
                this.contactPointImpulses = [
                    this.contactPointImpulses[1], 
                    this.contactPointImpulses[0]
                ];
            }
        } else {
            throw new Error(`${newCount} contact points is not supported`);
        }
        this.contactManifold = contactManifold;

        this.contactPointManifoldExtension = new Array(newCount);
        ContactConstraint.computeContactPointManifoldExtension(
            body0, body1, contactManifold, 
            this.contactPointManifoldExtension
        );
    }

    computeVelocity(body0: Body, body1: Body, contactPointIndex: number) {
        const contactPointManifoldExtension = 
        this.contactPointManifoldExtension[contactPointIndex];
        const displacement0 = contactPointManifoldExtension.displacement0;
        const displacement1 = contactPointManifoldExtension.displacement1;
        return Vector2D.subtract(
            body0.computeDisplacedVelocity(displacement0), 
            body1.computeDisplacedVelocity(displacement1)
        );
    }

    computeNormalVelocity(body0: Body, body1: Body, contactPointIndex: number) {
        return Vector2D.dot(
            this.contactManifold.normal, 
            this.computeVelocity(body0, body1, contactPointIndex)
        );
    }

    computeTangentVelocity(body0: Body, body1: Body, contactPointIndex: number) {
        return Vector2D.cross(
            this.contactManifold.normal, 
            this.computeVelocity(body0, body1, contactPointIndex)
        );
    }

    applyNormalImpulse(
        body0: Body, body1: Body, contactPointIndex: number, 
        normalImpulse: number
    ) {
        const normal = this.contactManifold.normal;
        const contactPointManifoldExtension = 
            this.contactPointManifoldExtension[contactPointIndex];
        body0.applyDisplacedImpulseInDirection(
            contactPointManifoldExtension.displacement0, normal, normalImpulse
        );
        body1.applyDisplacedImpulseInDirection(
            contactPointManifoldExtension.displacement1, normal, -normalImpulse
        );
    }

    applyNormalPositionImpulse(
        body0: Body, body1: Body, contactPointIndex: number, 
        normalPositionImpulse: number
    ) {
        const normal = this.contactManifold.normal;
        const contactPointManifoldExtension = 
            this.contactPointManifoldExtension[contactPointIndex];
        body0.applyDisplacedPositionImpulseInDirection(
            contactPointManifoldExtension.displacement0, normal, normalPositionImpulse
        );
        body1.applyDisplacedPositionImpulseInDirection(
            contactPointManifoldExtension.displacement1, normal, -normalPositionImpulse
        );
    }

    applyTangentImpulse(
        body0: Body, body1: Body, contactPointIndex: number, 
        tangentImpulse: number
    ) {
        const normal = this.contactManifold.normal;
        const contactPointManifoldExtension = 
            this.contactPointManifoldExtension[contactPointIndex];
        body0.applyDisplacedImpulseOrthogonalToDirection(
            contactPointManifoldExtension.displacement0, normal, tangentImpulse
        );
        body1.applyDisplacedImpulseOrthogonalToDirection(
            contactPointManifoldExtension.displacement1, normal, -tangentImpulse
        );
    }
    
    initializeVelocityConstraint(
        physicsEngine: PhysicsEngine, body0: Body, body1: Body, material: Material
    ): void {
        const count = this.contactPointImpulses.length;
        this.targetNormalVelocities = new Array(count);
        for (let i = 0; i < count; i++) {
            this.targetNormalVelocities[i] = 
                -material.bounciness * this.computeNormalVelocity(body0, body1, i);
            if (this.targetNormalVelocities[i] < physicsEngine.minimumBounceVelocity) {
                this.targetNormalVelocities[i] = 0;
            }

            const impulse = this.contactPointImpulses[i];
            impulse.normalImpulse *= physicsEngine.warmStarting;
            this.applyNormalImpulse(body0, body1, i, impulse.normalImpulse);
            impulse.tangentImpulse *= physicsEngine.warmStarting;
            this.applyTangentImpulse(body0, body1, i, impulse.tangentImpulse);
        }
    }

    static clampMagnitude(value: number, maxMagnitude: number) {
        if (value < -maxMagnitude) {
            return -maxMagnitude;
        }
        if (value > maxMagnitude) {
            return maxMagnitude;
        }
        return value;
    }

    constrainVelocity(
        physicsEngine: PhysicsEngine, body0: Body, body1: Body, material: Material
    ): void {
        const count = this.contactPointImpulses.length;
        for (let i = 0; i < count; i++) {
            const contactPointManifoldExtension = this.contactPointManifoldExtension[i];
            const impulse = this.contactPointImpulses[i];

            const tangentVelocity = this.computeTangentVelocity(body0, body1, i);
            const tangentMass = contactPointManifoldExtension.tangentMass;
            let deltaTangentImpulse = 
                (material.tangentSpeed - tangentVelocity) * tangentMass;
            const oldTangentImpulse = impulse.tangentImpulse;
            impulse.tangentImpulse += deltaTangentImpulse;
            impulse.tangentImpulse = ContactConstraint.clampMagnitude(
                impulse.tangentImpulse, material.friction * impulse.normalImpulse
            );
            deltaTangentImpulse = impulse.tangentImpulse - oldTangentImpulse;
            this.applyTangentImpulse(body0, body1, i, deltaTangentImpulse);
            
            const normalVelocity = this.computeNormalVelocity(body0, body1, i);
            const normalMass = contactPointManifoldExtension.normalMass;
            const targetNormalVelocity = this.targetNormalVelocities[i];
            let deltaNormalImpulse = 
                (targetNormalVelocity - normalVelocity) * normalMass;
            const oldNormalImpulse = impulse.normalImpulse;
            impulse.normalImpulse += deltaNormalImpulse;
            impulse.normalImpulse = Math.max(0, impulse.normalImpulse);
            deltaNormalImpulse = impulse.normalImpulse - oldNormalImpulse;
            this.applyNormalImpulse(body0, body1, i, deltaNormalImpulse);
        }
    }

    constrainPosition(physicsEngine: PhysicsEngine, body0: Body, body1: Body): void {
        const count = this.contactPointImpulses.length;
        for (let i = 0; i < count; i++) {
            const contactPointManifoldExtension = this.contactPointManifoldExtension[i];
            
            const normalMass = contactPointManifoldExtension.normalMass;
            const penetration = this.contactManifold.contactPoints[i].penetration;
            let positionImpulse = 
                Math.max(0, (penetration - physicsEngine.penetrationTolerance)) * 
                normalMass;
            this.applyNormalPositionImpulse(body0, body1, i, positionImpulse);
        }
    }
}