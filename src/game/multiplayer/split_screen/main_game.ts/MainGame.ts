class MainGame implements SplitScreenGame {
    static THUMBSTICK_DEAD_ZONE = 0.1;

    //localPolygons: ConvexPolygon[];
    physicsEngine: PhysicsEngine;
    frameRateMeasurementStartTime: number = Date.now();
    frameRateMeasurmentCounter: number = 0;

    constructor() {
        this.physicsEngine = PhysicsEngine.of();
        /*this.localPolygons = [];
        this.localPolygons.push(ConvexPolygon.of([
            Vector2D.cartesian(1, 1), 
            Vector2D.cartesian(-1, 1), 
            Vector2D.cartesian(-1, -1), 
            Vector2D.cartesian(1, -1)
        ]));

        this.localPolygons.push(ConvexPolygon.of([
            Vector2D.cartesian(1, 1), 
            Vector2D.cartesian(-1, 1), 
            Vector2D.cartesian(-1, -1)
        ]));*/
    }

    static of() {
        return new MainGame();
    }

    initialize(context: SplitScreenGameContext): void {
        this.physicsEngine.setDeltaTime(context.getTickDeltaTime());
        
        const material0 = Material.of(0.0, 0.0, 0.0);
        const localPolygon0 = [
            Vector2D.cartesian(1, 1), 
            Vector2D.cartesian(-1, 1), 
            Vector2D.cartesian(-1, -1), 
            Vector2D.cartesian(1, -1)
        ];
        const localPolygon1 = [
            Vector2D.cartesian(1, 1), 
            Vector2D.cartesian(-1, 1), 
            Vector2D.cartesian(-1, -1), 
        ];

        const body0 = Body.of(this.physicsEngine);
        body0.position.set(Vector2D.cartesian(0.01, 5));
        body0.setTrueVelocity(Vector2D.cartesian(0, 0));
        body0.setTrueAcceleration(Vector2D.cartesian(0, -9.81));
        body0.angularLightness = 0.4;
        body0.polygons.push(PhysicalPolygon.of(
            TransformedConvexPolygon.of(localPolygon1), 
            material0
        ));
        this.physicsEngine.bodies.push(body0);

        const body1 = Body.of(this.physicsEngine);
        body1.lightness = 0.0;
        body1.angularLightness = 0.0;
        body1.polygons.push(PhysicalPolygon.of(
            TransformedConvexPolygon.of(localPolygon0), 
            material0
        ));
        this.physicsEngine.bodies.push(body1);
    }

    deltaTimeChanged(context: SplitScreenGameContext): void {
        this.physicsEngine.setDeltaTime(context.getTickDeltaTime());
    }

    canvasResized(context: SplitScreenGameContext): void {
    }

    playerConnected(context: SplitScreenGameContext, index: number): void {
        console.log(`Player ${index} connected!`);
        context.getPlayerContext(index).camera.scale = 10;
    }

    playerDisconnected(context: SplitScreenGameContext, index: number): void {
        console.log(`Player ${index} disconnected!`);
    }

    mouseDown(context: SplitScreenGameContext, event: MouseEvent): void {
    }

    mouseUp(context: SplitScreenGameContext, event: MouseEvent): void {
    }

    mouseWheel(context: SplitScreenGameContext, event: WheelEvent): void {
    }

    tick(context: SplitScreenGameContext): void {
        const currentTime = Date.now();
        if (currentTime - this.frameRateMeasurementStartTime >= 1000) {
            console.log(`fps: this.count`);
            this.frameRateMeasurmentCounter = 0;
            this.frameRateMeasurementStartTime = currentTime;
        } else {
            this.frameRateMeasurmentCounter++;
        }

        this.physicsEngine.tick();

        const deltaTime = context.getTickDeltaTime();
        context.playerContexts.forEach((playerContext, playerIndex) => {
            const leftThumbstickVector = context.getLeftThumbstickVector(
                playerIndex
            );
            leftThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );
            playerContext.camera.position.addMultiplied(
                leftThumbstickVector, 10 * deltaTime
            );
            const rightThumbstickVector = context.getRightThumbstickVector(
                playerIndex
            );
            rightThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );
            playerContext.camera.scale *= Math.pow(
                10, -rightThumbstickVector.y * deltaTime
            );
        });
    }

    renderBackground(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        renderer.fillStyle = 'green';
        const start = region.start;
        const size = region.computeSize();
        renderer.fillRect(start.x, start.y, size.x, size.y);
    }

    renderHouse(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        
        renderer.beginPath();
        renderer.rect(-0.5, -0.5, 1, 1);
        renderer.fillStyle = 'rgb(252, 231, 164)';
        renderer.fill();
        
        renderer.beginPath();
        renderer.moveTo(0, 1);
        renderer.lineTo(0.7, 0.5);
        renderer.lineTo(-0.7, 0.5);
        renderer.closePath();
        renderer.fillStyle = 'brown';
        renderer.fill();
    }

    renderCameras(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        renderer.strokeStyle = 'black';
        renderer.lineWidth = 0.1;
        context.playerContexts.forEach((playerContext, playerIndex) => {
            renderer.save();
            const camera = playerContext.camera;
            const translation = camera.position;
            const scale = 0.1 * camera.scale;
            renderer.translate(translation.x, translation.y);
            renderer.scale(scale, scale);
            renderer.beginPath();
            renderer.moveTo(-1, 0);
            renderer.lineTo(1, 0);
            renderer.moveTo(0, -1);
            renderer.lineTo(0, 1);
            renderer.stroke();
            renderer.restore();
        });
    }

    static addPolygon(renderer: CanvasRenderingContext2D, vertices: Vector2D[]) {
        renderer.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            renderer.lineTo(vertices[i].x, vertices[i].y);
        }
        renderer.closePath();
    }

    renderBodies(context: SplitScreenGameContext, region: AABB, lag: number): void {
        const renderer = context.getRenderer();
        for (const body of this.physicsEngine.bodies) {
            for (const polygon of body.polygons) {
                const vertices = polygon.convexPolygon.globalPolygon.vertices;
                renderer.beginPath();
                MainGame.addPolygon(renderer, vertices);
                renderer.strokeStyle = 'black';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        }
    }

    renderContacts(context: SplitScreenGameContext, region: AABB, lag: number): void {
        const renderer = context.getRenderer();

        this.physicsEngine.contactConstraints.forEach((contactConstraint, contactKeyString) => {
            const contactManifold = contactConstraint.contactManifold;
            const normal = contactManifold.normal;
            const contactPoints = contactManifold.contactPoints;
            for (let i = 0; i < contactPoints.length; i++) {
                const contactPoint = contactPoints[i];
                const impulse = contactConstraint.contactPointImpulses[i];
                const position = contactPoint.position;
                const normalImpulse = impulse.normalImpulse;

                renderer.beginPath();
                renderer.arc(position.x, position.y, 0.05, 0, 2 * Math.PI);
                renderer.fillStyle = 'red';
                renderer.fill();
                renderer.beginPath();

                renderer.moveTo(position.x, position.y);
                const end = Vector2D.addMultiplied(position, normal, normalImpulse);
                renderer.lineTo(end.x, end.y);
                renderer.strokeStyle = 'orange';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        });
    }
    
    render(context: SplitScreenGameContext, region: AABB, lag: number): void {
        this.renderBackground(context, region, lag);
        this.renderHouse(context, region, lag);
        this.renderCameras(context, region, lag);
        this.renderBodies(context, region, lag);
        this.renderContacts(context, region, lag);

        /*const translations = []
        for (let i = 0; i < this.localPolygons.length; i++) {
            translations.push(Vector2D.zero());
        }
        context.playerContexts.forEach((playerContext, playerIndex) => {
            if (playerIndex < translations.length) {
                translations[playerIndex] = playerContext.camera.position;
            }
        });
        const globalPolygons = [];
        for (let i = 0; i < this.localPolygons.length; i++) {
            const localPolygon = this.localPolygons[i];
            const translation = translations[i];
            const vertices = [];
            for (let j = 0; j < localPolygon.vertices.length; j++) {
                vertices[j] = Vector2D.addMultiplied(
                    translation, localPolygon.vertices[j], 0.2
                );
            }
            globalPolygons[i] = ConvexPolygon.of(vertices);
        }

        const renderer = context.getRenderer();
        for (const globalPolygon of globalPolygons) {
            let vertex = globalPolygon.vertices[0];
            renderer.beginPath();
            renderer.moveTo(vertex.x, vertex.y);
            for (let i = 1; i < globalPolygon.vertices.length; i++) {
                vertex = globalPolygon.vertices[i];
                renderer.lineTo(vertex.x, vertex.y);
            }
            renderer.closePath();
            renderer.strokeStyle = 'black';
            renderer.lineWidth = 0.01;
            renderer.stroke();
        }
        for (let i = 0; i < globalPolygons.length - 1; i++) {
            const polygon0 = globalPolygons[i];
            for (let j = i + 1; j < globalPolygons.length; j++) {
                const polygon1 = globalPolygons[j];
                const contact = convexPolygonVsConvexPolygon(polygon0, polygon1);
                if (contact !== null) {
                    for (const contactPoint of contact.contactPoints) {
                        const position = contactPoint.position;
                        renderer.beginPath();
                        renderer.arc(position.x, position.y, 0.03, 0, 2 * Math.PI);
                        renderer.fillStyle = 'red';
                        renderer.fill();
                    }
                }
            }
        }*/
    }
}