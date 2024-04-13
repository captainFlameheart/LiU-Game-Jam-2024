

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

    constructor(game: any, player_index: number) {
        this.game = game;
        this.body = null;
        this.player_index = player_index;
    }

    initialize(height: number, width: number, centerX: number, centerY: number) {
        const material0 = Material.of(0, 0.1, 0.0);
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

        this.body.velocity.x = this.applyDamping(this.body.velocity.x, 0.5, context.getTickDeltaTime());
        this.body.velocity.y = this.applyDamping(this.body.velocity.y, 0.5, context.getTickDeltaTime());
        this.body.setTrueAngularVelocity (this.applyDamping(this.body.getTrueAngularVelocity(), 0.1, context.getTickDeltaTime()));

        const playerContext = context.getPlayerContext(this.player_index);
            console.log(this.player_index)

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
            
            
            if (context.aButtonPressed(this.player_index)) {
                this.game.physicsEngine.contactConstraints.forEach((contactConstraint:ContactConstraint, contactKeyString:string) => {
                    const contact_info = ContactKey.fromString(contactKeyString);

            
                    // Check if either of the bodies in the contact is the hat's body
                    if (this.game.physicsEngine.bodies[contact_info.body0 ]=== this.body || this.game.physicsEngine.bodies[contact_info.body1] === this.body) {
                        this.body.applyTureImpulse(Vector2D.cartesian(0, 2))
                    }
                });
            }

        

        this.body.applyForce(Vector2D.multiply(leftThumbstickVector, 4));
    

        if (navigator.platform !== "win32") {
            const gamepad = context.cartesianGameContext.gameContext.gamepads[this.player_index];

            let leftTriggerValue =  this.getNormalizedTriggerValue(gamepad?.axes[4]);
            if (leftTriggerValue !== undefined) {
                this.body.applyTorqe(leftTriggerValue * 0.01);
                this.body.angularVelocity
              
            }

            let rightTriggerValue = this.getNormalizedTriggerValue(gamepad?.axes[5]);
            if (rightTriggerValue !== undefined) {
                this.body.applyTorqe(-rightTriggerValue * 0.01);
            }
        } 
    }
    getNormalizedTriggerValue(triggerValue:any) {
        if (typeof(triggerValue) === "undefined" || triggerValue === null) {
            return undefined;
        }
        if (triggerValue === 0) {
            triggerValue = -1;
        }
        triggerValue += 1;
        triggerValue /= 2;
        return triggerValue;
    }

    applyDamping(initialValue:number, dampingCoefficient:number, deltaTime:number) {
        // Calculate the damping factor based on time delta squared
        const dampingFactor = Math.pow(dampingCoefficient, deltaTime);
        
        // Apply the damping factor to the initial value
        return initialValue * dampingFactor;
    }
}






