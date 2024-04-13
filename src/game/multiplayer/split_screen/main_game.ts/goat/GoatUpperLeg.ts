class GoatUpperLeg {
    static IMAGE_SCALE = 0.001;

    image: ImageBitmap | null;
    body: Body | null;

    constructor(image: ImageBitmap | null, body: Body | null) {
        this.image = image;
        this.body = body;
    }

    static of() {
        const image = null;
        const body = null;
        return new GoatUpperLeg(image, body);
    }

    initialize(game: MainGame, context: SplitScreenGameContext): Promise<void> {
        return loadImage('../images/goat_body.png').then(image => {
            this.image = image;
        }).then(() => {
            this.body = Body.of(game.physicsEngine);
            const bounciness = 0;
            const friction = 0.5;
            const tangentSpeed = 0;
            this.body.polygons.push(PhysicalPolygon.of(
                TransformedConvexPolygon.of([
                    Vector2D.cartesian(250 * GoatHead.IMAGE_SCALE, 150 * GoatHead.IMAGE_SCALE), 
                    Vector2D.cartesian(-250 * GoatHead.IMAGE_SCALE, 150 * GoatHead.IMAGE_SCALE), 
                    Vector2D.cartesian(-250 * GoatHead.IMAGE_SCALE, -150 * GoatHead.IMAGE_SCALE), 
                    Vector2D.cartesian(250 * GoatHead.IMAGE_SCALE, -150 * GoatHead.IMAGE_SCALE),
                ]), Material.of(bounciness, friction, tangentSpeed)
            ));

            this.body.angularLightness = 10;

            //this.body.setTrueAcceleration(Vector2D.cartesian(0, -9.81));
            game.physicsEngine.bodies.push(this.body);
        });
    }

    requireImage() {
        if (this.image === null) {
            throw new Error('Goat head image is null');
        }
        return this.image;
    }

    requireBody() {
        if (this.body === null) {
            throw new Error('Goat head image is null');
        }
        return this.body;
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number) {
        const renderer = context.getRenderer();
        renderer.save();
        const body = this.requireBody();
        const position = body.position;
        renderer.translate(position.x, position.y);
        renderer.rotate(body.angle);
        renderer.scale(GoatHead.IMAGE_SCALE, -GoatHead.IMAGE_SCALE);
        const image = this.requireImage();
        renderer.drawImage(image, -0.5 * image.width, -0.5 * image.height);
        renderer.restore();
    }
}