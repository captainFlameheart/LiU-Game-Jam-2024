class GoatLeg {
    upperLeg: GoatUpperLeg;
    lowerLeg: GoatLowerLeg;

    constructor(upperLeg: GoatUpperLeg, lowerLeg: GoatLowerLeg) {
        this.upperLeg = upperLeg;
        this.lowerLeg = lowerLeg;
    }

    static of() {
        const upperLeg = GoatUpperLeg.of();
        const lowerLeg = GoatLowerLeg.of();
        return new GoatLeg(upperLeg, lowerLeg);
    }

    initialize(
        game: MainGame, context: SplitScreenGameContext, 
        collisionCategory: number, collidableCategories: number
    ): Promise<void> {
        return Promise.all([
            this.upperLeg.initialize(game, context, collisionCategory, collidableCategories), 
            this.lowerLeg.initialize(game, context, collisionCategory, collidableCategories)
        ]).then(() => {
                const upperLegAnchor = Vector2D.cartesian(0, -150);
                const lowerLegAnchor = Vector2D.cartesian(0, 150);
                const joint = RevoluteJoint.of(
                    this.upperLeg.requireBody(), 
                    Vector2D.multiply(upperLegAnchor, Goat.IMAGE_SCALE), 
                    this.lowerLeg.requireBody(), 
                    Vector2D.multiply(lowerLegAnchor, Goat.IMAGE_SCALE), 
                    0, 0.7 * Math.PI
                );
                game.physicsEngine.constraints.push(joint);
            }
        );
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number) {
        this.lowerLeg.render(context, region, lag, playerIndex);
        this.upperLeg.render(context, region, lag, playerIndex);
    }
}