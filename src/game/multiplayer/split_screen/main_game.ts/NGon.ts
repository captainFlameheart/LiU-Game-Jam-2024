class NGon {
    game: any;  // Assuming this references a game context with a physics engine
    body: any;  // This will hold the reference to the physics body created
    constructor(game: any) {
        this.game = game;
    }

    initialize(n: number, radius: number, position: Vector2D) {
        const material0 = Material.of(0.0, 0.7, 0.0);  // Assuming Material.of creates a material object
        const vertices = this.generateNGonVertices(n, radius, position);
        this.body = this.createBody(vertices, position, material0);
        this.game.physicsEngine.bodies.push(this.body);
    }

    private generateNGonVertices(n: number, radius: number, center: Vector2D): Vector2D[] {
        const vertices = [];
        const angleStep = (2 * Math.PI) / n;  // Full circle divided by the number of sides

        for (let i = 0; i < n; i++) {
            const angle = i * angleStep;
            const vertex = Vector2D.fromPolar(angle, radius);
            vertices.push(new Vector2D(vertex.x + center.x, vertex.y + center.y));
        }

        return vertices;
    }

    private createBody(vertices: Vector2D[], position: Vector2D, material: any) {
        const body = Body.of(this.game.physicsEngine);  // Assuming Body constructor takes a position
        body.position.set(Vector2D.cartesian(0, 7))
        body.setTrueVelocity(new Vector2D(0, 0));  // Default velocity
        body.setTrueAcceleration(Vector2D.cartesian(0, -1))
        body.angularLightness = 10;  // Example property
        body.lightness = 10; //3
        body.angle = Math.PI;  // Example property

        if (!isCounterClockwise(vertices)) {
            console.log("Correcting polygon to counterclockwise order.");
            vertices = reversePoints(vertices);
        }
        body.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(vertices), material));

        return body;
    }


    tick(context: SplitScreenGameContext){

        this.body.velocity.x = this.applyDamping(this.body.velocity.x, 0.8, context.getTickDeltaTime());
        this.body.velocity.y = this.applyDamping(this.body.velocity.y, 0.8, context.getTickDeltaTime());

    }

    applyDamping(initialValue: number, dampingCoefficient: number, deltaTime: number) {
        // Calculate the damping factor based on time delta squared
        const dampingFactor = Math.pow(dampingCoefficient, deltaTime);

        // Apply the damping factor to the initial value
        return initialValue * dampingFactor;
    }

}
