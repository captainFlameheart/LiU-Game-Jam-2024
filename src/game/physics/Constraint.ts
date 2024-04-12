interface Constraint {
    initializeVelocityConstraint(physicsEngine: PhysicsEngine): void;

    constrainVelocity(physicsEngine: PhysicsEngine): void;

    constrainPosition(physicsEngine: PhysicsEngine): void;
}