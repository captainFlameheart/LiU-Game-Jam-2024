class Goat {
    static IMAGE_SCALE = 0.001;
    static COLLISION_CATEGORY = 0x00000001;
    static COLLIDABLE_CATEGORIES = ~this.COLLISION_CATEGORY;
    head: GoatHead;
    body: GoatBody;
    frontLeftUpperLeg: GoatUpperLeg;
    frontLeftLowerLeg: GoatLowerLeg;
    frontRightUpperLeg: GoatUpperLeg;
    frontRightLowerLeg: GoatLowerLeg;
    tail: GoatTail;

    constructor(
        head: GoatHead, body: GoatBody, 
        frontLeftUpperLeg: GoatUpperLeg, frontLeftLowerLeg: GoatUpperLeg, 
        frontRightUpperLeg: GoatUpperLeg, frontRightLowerLeg: GoatLowerLeg, 
        tail: GoatTail
    ) {
        this.head = head;
        this.body = body;
        this.frontLeftUpperLeg = frontLeftUpperLeg;
        this.frontLeftLowerLeg = frontLeftLowerLeg;
        this.frontRightUpperLeg = frontRightUpperLeg;
        this.frontRightLowerLeg = frontRightLowerLeg;
        this.tail = tail;
    }

    static of() {
        const head = GoatHead.of();
        const body = GoatBody.of();
        const frontLeftUpperLeg = GoatUpperLeg.of();
        const frontLeftLowerLeg = GoatLowerLeg.of();
        const frontRightUpperLeg = GoatUpperLeg.of();
        const frontRightLowerLeg = GoatUpperLeg.of();
        const tail = GoatTail.of();
        return new Goat(
            head, body, 
            frontLeftUpperLeg, frontLeftLowerLeg, 
            frontRightUpperLeg, frontRightLowerLeg, 
            tail
        );
    }

    initialize(game: MainGame, context: SplitScreenGameContext) {
        return this.head.initialize(game, context).then(
            () => this.body.initialize(game, context)
        ).then(
            () => this.frontLeftUpperLeg.initialize(game, context)
        ).then(
            () => this.frontLeftLowerLeg.initialize(game, context)
        ).then(
            () => this.frontRightUpperLeg.initialize(game, context)
        ).then(
            () => this.frontRightLowerLeg.initialize(game, context)
        ).then(
            () => this.tail.initialize(game, context)
        );
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number) {
        this.body.render(context, region, lag, playerIndex);
        this.frontLeftUpperLeg.render(context, region, lag, playerIndex);
        this.frontLeftLowerLeg.render(context, region, lag, playerIndex);
        this.frontRightUpperLeg.render(context, region, lag, playerIndex);
        this.frontRightLowerLeg.render(context, region, lag, playerIndex);
        this.head.render(context, region, lag, playerIndex);
        this.tail.render(context, region, lag, playerIndex);
    }
}