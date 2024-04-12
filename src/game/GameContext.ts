class GameContext {
    renderer: CanvasRenderingContext2D;
    tickDeltaTime: number;
    gamepads: (Gamepad | null)[]

    constructor(
        renderer: CanvasRenderingContext2D, tickDeltaTime: number, 
        gamepads: (Gamepad | null)[]
    ) {
        this.renderer = renderer;
        this.tickDeltaTime = tickDeltaTime;
        this.gamepads = gamepads;
    }

    static of(renderer: CanvasRenderingContext2D, tickDeltaTime: number) {
        const gamepads: (Gamepad | null)[] = [];
        return new GameContext(renderer, tickDeltaTime, gamepads);
    }

    getRenderer() {
        return this.renderer;
    }

    getCanvas() {
        return this.renderer.canvas;
    }

    getWidth() {
        return this.getCanvas().width;
    }

    getHeight() {
        return this.getCanvas().height;
    }

    computeSize() {
        return Vector2D.cartesian(this.getWidth(), this.getHeight());
    }

    computeHalfSize() {
        return Vector2D.halve(this.computeSize());
    }

    getTickDeltaTime() {
        return this.tickDeltaTime;
    }

    faceButtonPressed(gamepadIndex: number, buttonIndex: number) {
        return faceButtonPressed(this.gamepads, gamepadIndex, buttonIndex);
    }
    
    aButtonPressed(gamepadIndex: number) {
        return aButtonPressed(this.gamepads, gamepadIndex)
    }
    
    bButtonPressed(gamepadIndex: number) {
        return bButtonPressed(this.gamepads, gamepadIndex);
    }
    
    xButtonPressed(gamepadIndex: number) {
        return xButtonPressed(this.gamepads, gamepadIndex);
    }
    
    yButtonPressed(gamepadIndex: number) {
        return yButtonPressed(this.gamepads, gamepadIndex);
    }
    
    bumperPressed(gamepadIndex: number, buttonIndex: number) {
        return bumperPressed(this.gamepads, gamepadIndex, buttonIndex);
    }
    
    leftBumperPressed(gamepadIndex: number) {
        return leftBumperPressed(this.gamepads, gamepadIndex);
    }
    
    rightBumperPressed(gamepadIndex: number) {
        return rightBumperPressed(this.gamepads, gamepadIndex);
    }
    
    getTriggerState(gamepadIndex: number, buttonIndex: number) {
        return getTriggerState(this.gamepads, gamepadIndex, buttonIndex);
    }
    
    getLeftTriggerState(gamepadIndex: number) {
        return getLeftTriggerState(this.gamepads, gamepadIndex);
    }
    
    getRightTriggerState(gamepadIndex: number) {
        return getRightTriggerState(this.gamepads, gamepadIndex);
    }
    
    getThumbstickVector(gamepadIndex: number, thumbstickIndex: number) {
        return getThumbstickVector(this.gamepads, gamepadIndex, thumbstickIndex);
    }
    
    getLeftThumbstickVector(gamepadIndex: number) {
        return getLeftThumbstickVector(this.gamepads, gamepadIndex);
    }
    
    getRightThumbstickVector(gamepadIndex: number) {
        return getRightThumbstickVector(this.gamepads, gamepadIndex);
    }
}