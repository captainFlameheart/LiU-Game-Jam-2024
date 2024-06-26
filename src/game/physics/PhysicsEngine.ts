class PhysicsEngine {
    velocityIterations: number;
    positionIterations: number;
    warmStarting: number;
    penetrationTolerance: number;
    minimumBounceVelocity: number;
    deltaTime: number;
    bodies: Body[];
    constraints: Constraint[];
    contactConstraints: Map<string, ContactConstraint>;
    
    constructor(
        velocityIterations: number, 
        positionIterations: number, 
        warmStarting: number, 
        penetrationTolerance: number, 
        minimumBounceVelocity: number, 
        deltaTime: number, 
        bodies: Body[], 
        constraints: Constraint[], 
        contactConstraints: Map<string, ContactConstraint>
    ) {
        this.velocityIterations = velocityIterations;
        this.positionIterations = positionIterations;
        this.warmStarting = warmStarting;
        this.penetrationTolerance = penetrationTolerance;
        this.minimumBounceVelocity = minimumBounceVelocity;
        this.deltaTime = deltaTime;
        this.bodies = bodies;
        this.constraints = constraints;
        this.contactConstraints = contactConstraints;
    }

    static of() {
        const velocityIterations = 20;
        const positionIterations = 2;
        const warmStarting = 1;
        const penetrationTolerance = 0.03;
        const minimumBounceVelocity = 0.1;
        const deltaTime = 1;
        const bodies: Body[] = [];
        const constraints: Constraint[] = [];
        const contactConstraints: Map<string, ContactConstraint> = new Map();
        return new PhysicsEngine(
            velocityIterations, positionIterations, warmStarting, 
            penetrationTolerance, minimumBounceVelocity, deltaTime, 
            bodies, constraints, contactConstraints
        );
    }

    setDeltaTime(deltaTime: number) {
        this.deltaTime = deltaTime;Material
        // TODO: Rescale velocities and accelerations
    }

    updateContactConstraintsBetweenPolygons(
        body0Index: number, polygon0Index: number, 
        body1Index: number, polygon1Index: number
    ) {
        const body0 = this.bodies[body0Index];
        const polygon0 = body0.polygons[polygon0Index].convexPolygon.globalPolygon;
        const body1 = this.bodies[body1Index];
        const polygon1 = body1.polygons[polygon1Index].convexPolygon.globalPolygon;
        const contactKey = ContactKey.of(
            body0Index, polygon0Index, body1Index, polygon1Index
        );
        const contactKeyString = contactKey.toString();
        
        const contactManifold = convexPolygonVsConvexPolygon(polygon0, polygon1);
        if (contactManifold === null) {
            this.contactConstraints.delete(contactKeyString);
            return false;
        } else {
            const contactConstraint = this.contactConstraints.get(contactKeyString);
            if (contactConstraint === undefined) {
                this.contactConstraints.set(contactKeyString, 
                    ContactConstraint.of(this, body0, body1, contactManifold)
                );
            } else {
                contactConstraint.setContactManifold(
                    this, body0, body1, contactManifold
                );
            }
            return true;
        }
    }

    updateContactConstraintsBetweenBodies(body0Index: number, body1Index: number) {
        const body0 = this.bodies[body0Index];
        const body1 = this.bodies[body1Index];
        const polygonCount0 = body0.polygons.length;
        const polygonCount1 = body1.polygons.length;
        for (let polygon0Index = 0; polygon0Index < polygonCount0; polygon0Index++) {
            const polygon0 = body0.polygons[polygon0Index];
            for (let polygon1Index = 0; polygon1Index < polygonCount1; polygon1Index++) {
                const polygon1 = body1.polygons[polygon1Index];
                if (
                    (polygon0.collidableCategories & polygon1.categories) && 
                    (polygon1.collidableCategories & polygon0.categories)
                ) {
                    this.updateContactConstraintsBetweenPolygons(
                        body0Index, polygon0Index, 
                        body1Index, polygon1Index
                    );
                }
            }
        }
    }

    updateContactConstraints() {
        for (let body0Index = 0; body0Index < this.bodies.length - 1; body0Index++) {
            for (let body1Index = body0Index + 1; body1Index < this.bodies.length; body1Index++) {
                this.updateContactConstraintsBetweenBodies(body0Index, body1Index);
            }    
        }
    }

    tick() {
        this.updateContactConstraints();

        for (const body of this.bodies) {
            body.integrateAcceleration();
        }

        for (const constraint of this.constraints) {
            constraint.initializeVelocityConstraint(this);
        }
        this.contactConstraints.forEach((contactConstraint, contactKeySting) => {
            const contactKey = ContactKey.fromString(contactKeySting);

            const body0 = this.bodies[contactKey.body0];
            const body1 = this.bodies[contactKey.body1];

            const polygon0 = body0.polygons[contactKey.shape0]
            const polygon1 = body1.polygons[contactKey.shape1]

            const material0 = polygon0.material;
            const material1 = polygon1.material;
            
            const bounciness = Math.max(material0.bounciness, material1.bounciness)
            
            contactConstraint.initializeVelocityConstraint(
                this, body0, body1, bounciness
            );

            
        })

        for (let i = 0; i < this.velocityIterations; i++) {
            for (const constraint of this.constraints) {
                constraint.constrainVelocity(this);
            }
            this.contactConstraints.forEach((contactConstraint, contactKeyString) => {
                const contactKey = ContactKey.fromString(contactKeyString);
                const body0 = this.bodies[contactKey.body0];
                const body1 = this.bodies[contactKey.body1];


                const polygon0 = body0.polygons[contactKey.shape0]
                const polygon1 = body1.polygons[contactKey.shape1]
    
                const material0 = polygon0.material;
                const material1 = polygon1.material;
                
       

                const friction = Math.sqrt(material0.friction * material1.friction)
                const tangentSpeed = material0.tangentSpeed + material1.tangentSpeed
                

                contactConstraint.constrainVelocity(
                    this, body0, body1, friction, tangentSpeed
                );
            })
        }

        for (const body of this.bodies) {
            body.integrateVelocity();
        }

        for (let i = 0; i < this.positionIterations; i++) {
            for (const constraint of this.constraints) {
                constraint.constrainPosition(this);
            }
            this.contactConstraints.forEach((contactConstraint, contactKeyString) => {
                const contactKey = ContactKey.fromString(contactKeyString);
                const body0Index = contactKey.body0;
                const body0 = this.bodies[body0Index];
                const polygon0Index = contactKey.shape0;
                const body1Index = contactKey.body1;
                const body1 = this.bodies[body1Index];
                const polygon1Index = contactKey.shape1;

                body0.updatePolygon(polygon0Index);
                body1.updatePolygon(polygon1Index);
                const inContact = this.updateContactConstraintsBetweenPolygons(
                    body0Index, polygon0Index, body1Index, polygon1Index
                );
                if (inContact) {
                    contactConstraint.constrainPosition(this, body0, body1);
                }
            });
        }

        for (const body of this.bodies) {
            body.updateShapes();
        }
    }
}
