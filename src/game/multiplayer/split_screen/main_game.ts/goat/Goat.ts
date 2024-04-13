class Goat {
    head: GoatHead;
    body: GoatBody;
    frontLeftUpperLeg: GoatUpperLeg;

    constructor(head: GoatHead, body: GoatBody, frontLeftUpperLeg: GoatBody) {
        this.head = head;
        this.body = body;
        this.frontLeftUpperLeg = GoatUpperLeg.of();
    }

    static of() {
        const head = GoatHead.of();
        const body = GoatBody.of();
        const frontLeftUpperLeg = GoatBody.of();
        return new Goat(head, body, frontLeftUpperLeg);
    }

    initialize(game: MainGame, context: SplitScreenGameContext) {
        return this.head.initialize(game, context).then(
            () => this.body.initialize(game, context)
        );
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number) {
        this.head.render(context, region, lag, playerIndex);
        this.body.render(context, region, lag, playerIndex);
    }
}