class SplitScreenPlayerContext {
    camera: CartesianTransform;

    constructor(camera: CartesianTransform) {
        this.camera = camera;
    }

    static of() {
        const camera = CartesianTransform.of(Vector2D.zero(), 1);
        return new SplitScreenPlayerContext(camera);
    }
}