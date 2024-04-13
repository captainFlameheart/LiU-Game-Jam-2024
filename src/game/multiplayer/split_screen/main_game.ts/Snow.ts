class Snow {
    img: HTMLImageElement = new Image();
    position: Vector2D;
    rotation: number = 0;
    sway: number = 4; // Amplitude
    pizzazz: number = 0; // Angular velocity
    hurry: number = 0; // Downward velocity
    scale: number = 0;
    angle: number = 0;
    context: SplitScreenGameContext | null = null;

    constructor() {
        this.img.src = "../images/edvard.png";
        this.position = Vector2D.zero();

    }

    static letItSnow(context: SplitScreenGameContext, sway: number, pizzazz: number, hurry: number, scale: number) {
        let snow = new Snow();
        snow.context = context;
        snow.sway = sway;
        snow.pizzazz = pizzazz;
        snow.hurry = hurry;
        snow.scale = scale;
        return snow;
    }

    tick() {
        const context = this.context as SplitScreenGameContext
        const dt = context.getTickDeltaTime();
        this.angle = (this.angle + this.pizzazz * dt) % (Math.PI * 2)
        this.position = Vector2D.cartesian(Math.sin(this.angle) * this.sway, this.position.getY() - this.hurry * dt);
    }

    render(context: SplitScreenGameContext, region: AABB, lag: number) {
        const render = context.getRenderer();
        const pattern = render.createPattern(this.img, "repeat");
        const size = region.computeSize();
        if (pattern === null) return;
        
        render.save();
        render.fillStyle = pattern;
        pattern.setTransform(
            new DOMMatrix()
            .translate(this.position.getX(), this.position.getY())
            .scale(0.01 * this.scale)
        )
        render.fillRect(
            region.start.getX(),
            region.start.getY(),
            size.getX(), 
            size.getY()
        );
        render.restore();
    }
}