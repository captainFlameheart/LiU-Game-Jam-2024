class GoatUpperLeg {
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

    initialize(
        game: MainGame, context: SplitScreenGameContext, 
        collisionCategory: number, collidableCategories: number
    ): Promise<void> {
        return loadImage('../images/goat_upper_leg.png').then(image => {
            this.image = image;
        }).then(() => {
            console.log('Initializing upper leg');
            this.body = Body.of(game.physicsEngine);
            const bounciness = 0;
            const friction = 1;
            const tangentSpeed = 0;
            this.body.polygons.push(PhysicalPolygon.withCollisionFiltering(
                TransformedConvexPolygon.of([
                    Vector2D.cartesian(100 * Goat.IMAGE_SCALE, 150 * Goat.IMAGE_SCALE), 
                    Vector2D.cartesian(-100 * Goat.IMAGE_SCALE, 150 * Goat.IMAGE_SCALE), 
                    Vector2D.cartesian(-100 * Goat.IMAGE_SCALE, -150 * Goat.IMAGE_SCALE), 
                    Vector2D.cartesian(100 * Goat.IMAGE_SCALE, -150 * Goat.IMAGE_SCALE),
                ]), Material.of(bounciness, friction, tangentSpeed),
                collisionCategory, collidableCategories
            ));

            this.body.lightness = 50;
            this.body.angularLightness = 50;

            this.body.setTrueAcceleration(Vector2D.cartesian(0, -12));
            game.physicsEngine.bodies.push(this.body);
        });
    }

    requireImage() {
        if (this.image === null) {
            throw new Error('Image is null');
        }
        return this.image;
    }

    requireBody() {
        if (this.body === null) {
            throw new Error('Body is null');
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
        renderer.scale(Goat.IMAGE_SCALE, -Goat.IMAGE_SCALE);
        const image = this.requireImage();
        renderer.drawImage(image, -0.5 * image.width, -0.5 * image.height);
        renderer.restore();
    }
}