class CartesianGameContext {
    static NO_HALF_SIZE_MESSAGE = 'The half size is null';

    gameContext: GameContext;
    halfSize: Vector2D | null;
    cartesianMousePosition: Vector2D;

    constructor(
        gameContext: GameContext, halfSize: Vector2D | null, 
        cartesianMousePosition: Vector2D
    ) {
        this.gameContext = gameContext;
        this.halfSize = halfSize;
        this.cartesianMousePosition = cartesianMousePosition;
    }

    static of(
        gameContext: GameContext, halfSize: Vector2D | null, 
        cartesianMousePosition: Vector2D
    ) {
        return new CartesianGameContext(
            gameContext, halfSize, cartesianMousePosition
        );
    }

    static fromGameContext(gameContext: GameContext) {
        const halfSize = null;
        const cartesianMousePosition = Vector2D.zero();
        return new CartesianGameContext(gameContext, null, cartesianMousePosition);
    }

    getHalfSize(): Vector2D {
        if (this.halfSize === null) {
            throw new Error(CartesianGameContext.NO_HALF_SIZE_MESSAGE);
        }
        return this.halfSize;
    }

    getTickDeltaTime(): number {
        return this.gameContext.tickDeltaTime;
    }

    getRenderer(): CanvasRenderingContext2D {
        return this.gameContext.renderer;
    }

    faceButtonPressed(gamepadIndex: number, buttonIndex: number) {
        return this.gameContext.faceButtonPressed(gamepadIndex, buttonIndex);
    }
    
    aButtonPressed(gamepadIndex: number) {
        return this.gameContext.aButtonPressed(gamepadIndex);
    }
    
    bButtonPressed(gamepadIndex: number) {
        return this.gameContext.bButtonPressed(gamepadIndex);
    }
    
    xButtonPressed(gamepadIndex: number) {
        return this.gameContext.xButtonPressed(gamepadIndex);
    }
    
    yButtonPressed(gamepadIndex: number) {
        return this.gameContext.yButtonPressed(gamepadIndex);
    }
    
    bumperPressed(gamepadIndex: number, buttonIndex: number) {
        return this.gameContext.bumperPressed(gamepadIndex, buttonIndex);
    }
    
    leftBumperPressed(gamepadIndex: number) {
        return this.gameContext.leftBumperPressed(gamepadIndex);
    }
    
    rightBumperPressed(gamepadIndex: number) {
        return this.gameContext.rightBumperPressed(gamepadIndex);
    }
    
    getTriggerState(gamepadIndex: number, buttonIndex: number) {
        return this.gameContext.getTriggerState(gamepadIndex, buttonIndex);
    }
    
    getLeftTriggerState(gamepadIndex: number) {
        return this.gameContext.getLeftTriggerState(gamepadIndex);
    }
    
    getRightTriggerState(gamepadIndex: number) {
        return this.gameContext.getRightTriggerState(gamepadIndex);
    }
    
    getThumbstickVector(gamepadIndex: number, thumbstickIndex: number) {
        return this.gameContext.getThumbstickVector(gamepadIndex, thumbstickIndex);
    }
    
    getLeftThumbstickVector(gamepadIndex: number) {
        return this.gameContext.getLeftThumbstickVector(gamepadIndex);
    }
    
    getRightThumbstickVector(gamepadIndex: number) {
        return this.gameContext.getRightThumbstickVector(gamepadIndex);
    }
}