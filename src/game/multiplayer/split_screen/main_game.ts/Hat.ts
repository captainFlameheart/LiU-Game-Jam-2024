function isCounterClockwise(points: Vector2D[]): boolean {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length]; // Wrap around to the first point
        // Adjust the formula: Use (current.x * next.y - next.x * current.y)
        sum += (current.x * next.y - next.x * current.y);
    }
    return sum > 0; // Positive sum indicates counterclockwise order
}


function reversePoints(points: Vector2D[]): Vector2D[] {
    return points.slice().reverse(); // Creates a new array and reverses the order of the points
}

class Hat {
    game: any; // Placeholder for the game object, which includes the physics engine
    body: any;
    player_index: number;
    static gravity: number = -3

    constructor(game: any) {
        this.game = game;
        this.body = null;
        this.player_index = 0;
    }

    initialize(height: number, width: number, centerX: number, centerY: number) {
        const material0 = Material.of(0.0, 0.0, 0.0);
        const origin_move = -0 * height;
        const wall_thickness = 0.06 * width;
        const wall_height = 0.3 * height;
        const lip_height = 0.05 * height;
        const lip_outward = 0.2 * width;

        // Define polygons
        const polygons = [
            [
                new Vector2D(0.25 * width + centerX, 0.05 * height - origin_move + centerY),
                new Vector2D(-0.25 * width + centerX, 0.05 * height - origin_move + centerY),
                new Vector2D(-0.25 * width + centerX, -0.05 * height - origin_move + centerY),
                new Vector2D(0.25 * width + centerX, -0.05 * height - origin_move + centerY)
            ],
            [
                new Vector2D((0.25 - wall_thickness) * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D(0.25 * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D(0.25 * width + centerX, -0.05 * height - origin_move + centerY),
                new Vector2D((0.25 - wall_thickness) * width + centerX, -0.05 * height - origin_move + centerY)
            ],
            [
                new Vector2D(-0.25 * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D((-0.25 + wall_thickness) * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D((-0.25 + wall_thickness) * width + centerX, -0.05 * height - origin_move + centerY),
                new Vector2D(-0.25 * width + centerX, -0.05 * height - origin_move + centerY)
            ],
            [
                new Vector2D(0.25 * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D((0.25 + lip_outward) * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D((0.25 + lip_outward) * width + centerX, -0.05 * height - origin_move - wall_height - lip_height + centerY),
                new Vector2D(0.25 * width + centerX, -0.05 * height - origin_move - wall_height - lip_height + centerY)
            ],
            [
                new Vector2D((-0.25 - lip_outward) * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D(-0.25 * width + centerX, -0.05 * height - origin_move - wall_height + centerY),
                new Vector2D(-0.25 * width + centerX, -0.05 * height - origin_move - wall_height - lip_height + centerY),
                new Vector2D((-0.25 - lip_outward) * width + centerX, -0.05 * height - origin_move - wall_height - lip_height + centerY)
            ]
        ];

        const hat_bottom = Body.of(this.game.physicsEngine);
        hat_bottom.position.set(Vector2D.cartesian(0, 5));
        hat_bottom.setTrueVelocity(Vector2D.cartesian(0, 0));

        hat_bottom.angularLightness = 10;
        hat_bottom.angle = Math.PI;

        // Verify each polygon's order and correct if necessary
        polygons.forEach((polygon, index) => {
            if (!isCounterClockwise(polygon)) {
                console.log(`Correcting polygon at index ${index} to counterclockwise order.`);
                polygon = reversePoints(polygon);
            }
            hat_bottom.polygons.push(PhysicalPolygon.of(TransformedConvexPolygon.of(polygon), material0));
        });

        this.game.physicsEngine.bodies.push(hat_bottom);

        this.body = hat_bottom;


    }


    tick(context: SplitScreenGameContext){

        this.body.setTrueAcceleration(Vector2D.cartesian(0, Hat.gravity));
        const deltaTime = context.getTickDeltaTime();
        this.body.angularAcceleration = 0;

        const playerContext = context.getPlayerContext(this.player_index);


    
            const leftThumbstickVector = context.getLeftThumbstickVector(
                 this.player_index
            );
            leftThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );
            const rightThumbstickVector = context.getRightThumbstickVector(
                 this.player_index
            );
            rightThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );
            


        this.body.applyForce(Vector2D.multiply(leftThumbstickVector, 4));
        
        const left_trigger_value = context.cartesianGameContext.gameContext.gamepads[this.player_index]?.axes[4]
        if (typeof(left_trigger_value) !== "undefined"){
            this.body.applyTorqe(left_trigger_value*0.01);
            console.log(left_trigger_value)
        } 
        




    
    }
}
