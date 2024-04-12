interface CartesianGame {
    initialize(context: CartesianGameContext): void;
    
    deltaTimeChanged(context: CartesianGameContext): void;

    canvasResized(context: CartesianGameContext): void;

    gamepadConnected(context: CartesianGameContext, index: number): void;

    gamepadDisconnected(context: CartesianGameContext, index: number): void;

    mouseDown(context: CartesianGameContext, event: MouseEvent): void;

    mouseUp(context: CartesianGameContext, event: MouseEvent): void;

    mouseWheel(context: CartesianGameContext, event: WheelEvent): void;

    tick(context: CartesianGameContext): void;

    render(context: CartesianGameContext, lag: number): void;
}