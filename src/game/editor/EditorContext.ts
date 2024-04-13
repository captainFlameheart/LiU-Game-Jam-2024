class EditorContext {
    cartesianGameContext: CartesianGameContext;
    camera: CartesianTransform;
    worldMousePosition: Vector2D;

    constructor(
        cartesianGameContext: CartesianGameContext, 
        camera: CartesianTransform, 
        worldMousePosition: Vector2D
    ) {
        this.cartesianGameContext = cartesianGameContext;
        this.camera = camera;
        this.worldMousePosition = worldMousePosition;
    }

    static of(
        cartesianGameContext: CartesianGameContext, 
        camera: CartesianTransform, 
        worldMousePosition: Vector2D
    ) {
        return new EditorContext(
            cartesianGameContext, camera, worldMousePosition
        );
    }

    getRenderer() {
        return this.cartesianGameContext.getRenderer();
    }

    getTickDeltaTime() {
        return this.cartesianGameContext.getTickDeltaTime();
    }
}