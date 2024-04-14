class Goat {
    static IMAGE_SCALE = 0.0005;
    static FRONT_LEFT_LEG_COLLISION_CATEGORY = 0b00000001;
    static FRONT_RIGHT_LEG_COLLISION_CATEGORY = 0b00000010;
    static UPPER_GOAT_COLLISION_CATEGORY = 0b00000100;
    
    static FRONT_LEFT_LEG_COLLIDABLE_CATEGORIES = ~(
        this.FRONT_LEFT_LEG_COLLISION_CATEGORY |
        this.UPPER_GOAT_COLLISION_CATEGORY
    );
    static FRONT_RIGHT_LEG_COLLIDABLE_CATEGORIES = ~(
        this.FRONT_RIGHT_LEG_COLLISION_CATEGORY | 
        this.UPPER_GOAT_COLLISION_CATEGORY
    );
    static UPPER_GOAT_COLLIDABLE_CATEGORIES = ~(
        this.UPPER_GOAT_COLLISION_CATEGORY | 
        this.FRONT_LEFT_LEG_COLLISION_CATEGORY | 
        this.FRONT_RIGHT_LEG_COLLISION_CATEGORY
    )
    
    head: GoatHead;
    body: GoatBody;
    frontLeftLeg: GoatLeg;
    frontRightLeg: GoatLeg;
    backLeftLeg: GoatLeg;
    backRightLeg: GoatLeg;
    tail: GoatTail;

    constructor(
        head: GoatHead, body: GoatBody, 
        frontLeftLeg: GoatLeg, frontRightLeg: GoatLeg, 
        backLeftLeg: GoatLeg, backRightLeg: GoatLeg, 
        tail: GoatTail
    ) {
        this.head = head;
        this.body = body;
        this.frontLeftLeg = frontLeftLeg;
        this.frontRightLeg = frontRightLeg;
        this.backLeftLeg = backLeftLeg;
        this.backRightLeg = backRightLeg;
        this.tail = tail;
    }

    static of() {
        const head = GoatHead.of();
        const body = GoatBody.of();
        const frontLeftLeg = GoatLeg.of();
        const frontRightLeg = GoatLeg.of();
        const backLeftLeg = GoatLeg.of();
        const backRightLeg = GoatLeg.of();
        const tail = GoatTail.of();
        return new Goat(
            head, body, 
            frontLeftLeg, frontRightLeg, 
            backLeftLeg, backRightLeg, 
            tail
        );
    }

    initialize(game: MainGame, context: SplitScreenGameContext) {
        console.log(`Left: ${Goat.FRONT_LEFT_LEG_COLLIDABLE_CATEGORIES}`);
        return Promise.all([
            this.head.initialize(game, context),
            
            this.body.initialize(game, context), 
            this.frontLeftLeg.initialize(
                game, context, 
                Goat.FRONT_LEFT_LEG_COLLISION_CATEGORY, Goat.FRONT_LEFT_LEG_COLLIDABLE_CATEGORIES
            ), 
            this.frontRightLeg.initialize(
                game, context, 
                Goat.FRONT_RIGHT_LEG_COLLISION_CATEGORY, Goat.FRONT_RIGHT_LEG_COLLIDABLE_CATEGORIES
            ), 
            this.backLeftLeg.initialize(
                game, context, 
                Goat.FRONT_LEFT_LEG_COLLISION_CATEGORY, Goat.FRONT_LEFT_LEG_COLLIDABLE_CATEGORIES
            ),
            this.backRightLeg.initialize(
                game, context, 
                Goat.FRONT_RIGHT_LEG_COLLISION_CATEGORY, Goat.FRONT_RIGHT_LEG_COLLIDABLE_CATEGORIES
            ), 
            this.tail.initialize(game, context)
        ]).then(() => {
            this.backLeftLeg.upperLeg.requireBody().position.y = 10;
            this.backRightLeg.upperLeg.requireBody().position.y = 10;
            
            const leftLegBodyAnchor = Vector2D.cartesian(-250, -100);
            const leftUpperLegAnchor = Vector2D.cartesian(0, 150);
            const frontLeftLegJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(leftLegBodyAnchor, Goat.IMAGE_SCALE), 
                this.frontLeftLeg.upperLeg.requireBody(), 
                Vector2D.multiply(leftUpperLegAnchor, Goat.IMAGE_SCALE), 
                -0.25 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(frontLeftLegJoint);

            const rightLegBodyAnchor = Vector2D.cartesian(200, -50);
            const rightUpperLegAnchor = Vector2D.cartesian(0, 150);
            const frontRightLegJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(rightLegBodyAnchor, Goat.IMAGE_SCALE), 
                this.frontRightLeg.upperLeg.requireBody(), 
                Vector2D.multiply(rightUpperLegAnchor, Goat.IMAGE_SCALE), 
                -0.25 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(frontRightLegJoint);

            const backLeftLegJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(leftLegBodyAnchor, Goat.IMAGE_SCALE), 
                this.backLeftLeg.upperLeg.requireBody(), 
                Vector2D.multiply(leftUpperLegAnchor, Goat.IMAGE_SCALE), 
                -0.25 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(backLeftLegJoint);

            const backRightLegJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(rightLegBodyAnchor, Goat.IMAGE_SCALE), 
                this.backRightLeg.upperLeg.requireBody(), 
                Vector2D.multiply(rightUpperLegAnchor, Goat.IMAGE_SCALE), 
                -0.25 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(backRightLegJoint);

            const headBodyAnchor = Vector2D.cartesian(-250, 100);
            const headAnchor = Vector2D.cartesian(0, 0);
            const headJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(headBodyAnchor, Goat.IMAGE_SCALE), 
                this.head.requireBody(), 
                Vector2D.multiply(headAnchor, Goat.IMAGE_SCALE), 
                -0.5 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(headJoint);

            const tailBodyAnchor = Vector2D.cartesian(300, 0);
            const tailAnchor = Vector2D.cartesian(-150, 0);
            const tailJoint = RevoluteJoint.of(
                this.body.requireBody(), 
                Vector2D.multiply(tailBodyAnchor, Goat.IMAGE_SCALE), 
                this.tail.requireBody(), 
                Vector2D.multiply(tailAnchor, Goat.IMAGE_SCALE), 
                -0.5 * Math.PI, 0.5 * Math.PI
            );
            game.physicsEngine.constraints.push(tailJoint);
        });
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number) {
        this.backLeftLeg.render(context, region, lag, playerIndex);
        this.backRightLeg.render(context, region, lag, playerIndex);
        this.tail.render(context, region, lag, playerIndex);
        this.body.render(context, region, lag, playerIndex);
        this.frontLeftLeg.render(context, region, lag, playerIndex);
        this.frontRightLeg.render(context, region, lag, playerIndex);
        this.head.render(context, region, lag, playerIndex);
    }
}