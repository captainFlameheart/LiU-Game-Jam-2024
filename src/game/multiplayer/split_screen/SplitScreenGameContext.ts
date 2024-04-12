class SplitScreenGameContext {
    cartesianGameContext: CartesianGameContext;
    playerContexts: Map<number, SplitScreenPlayerContext>;

    constructor(
        cartesianGameContext: CartesianGameContext, 
        playerContexts: Map<number, SplitScreenPlayerContext>
    ) {
        this.cartesianGameContext = cartesianGameContext;
        this.playerContexts = playerContexts;
    }

    static of(cartesianGameContext: CartesianGameContext) {
        const playerContexts = new Map();
        return new SplitScreenGameContext(
            cartesianGameContext, playerContexts
        );
    }

    gamepadConnected(index: number) {
        this.playerContexts.set(
            index, SplitScreenPlayerContext.of()
        );
    }

    gamepadDisconnected(index: number) {
        this.playerContexts.delete(index);
    }

    getPlayerContext(index: number) {
        const playerContext = this.playerContexts.get(index);
        if (playerContext === undefined) {
            throw new Error(`No player has index ${index}`);
        }
        return playerContext;
    }

    getTickDeltaTime() {
        return this.cartesianGameContext.getTickDeltaTime();
    }

    getRenderer() {
        return this.cartesianGameContext.getRenderer();
    }

    faceButtonPressed(gamepadIndex: number, buttonIndex: number) {
        return this.cartesianGameContext.faceButtonPressed(gamepadIndex, buttonIndex);
    }
    
    aButtonPressed(gamepadIndex: number) {
        return this.cartesianGameContext.aButtonPressed(gamepadIndex);
    }
    
    bButtonPressed(gamepadIndex: number) {
        return this.cartesianGameContext.bButtonPressed(gamepadIndex);
    }
    
    xButtonPressed(gamepadIndex: number) {
        return this.cartesianGameContext.xButtonPressed(gamepadIndex);
    }
    
    yButtonPressed(gamepadIndex: number) {
        return this.cartesianGameContext.yButtonPressed(gamepadIndex);
    }
    
    bumperPressed(gamepadIndex: number, buttonIndex: number) {
        return this.cartesianGameContext.bumperPressed(gamepadIndex, buttonIndex);
    }
    
    leftBumperPressed(gamepadIndex: number) {
        return this.cartesianGameContext.leftBumperPressed(gamepadIndex);
    }
    
    rightBumperPressed(gamepadIndex: number) {
        return this.cartesianGameContext.rightBumperPressed(gamepadIndex);
    }
    
    getTriggerState(gamepadIndex: number, buttonIndex: number) {
        return this.cartesianGameContext.getTriggerState(gamepadIndex, buttonIndex);
    }
    
    getLeftTriggerState(gamepadIndex: number) {
        return this.cartesianGameContext.getLeftTriggerState(gamepadIndex);
    }
    
    getRightTriggerState(gamepadIndex: number) {
        return this.cartesianGameContext.getRightTriggerState(gamepadIndex);
    }
    
    getThumbstickVector(gamepadIndex: number, thumbstickIndex: number) {
        return this.cartesianGameContext.getThumbstickVector(gamepadIndex, thumbstickIndex);
    }
    
    getLeftThumbstickVector(gamepadIndex: number) {
        return this.cartesianGameContext.getLeftThumbstickVector(gamepadIndex);
    }
    
    getRightThumbstickVector(gamepadIndex: number) {
        return this.cartesianGameContext.getRightThumbstickVector(gamepadIndex);
    }
}