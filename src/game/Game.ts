interface Game {
    initialize(context: GameContext): void;

    deltaTimeChanged(context: GameContext): void;

    canvasResized(context: GameContext): void;

    gamepadConnected(context: GameContext, index: number): void;

    gamepadDisconnected(context: GameContext, index: number): void;

    mouseDown(context: GameContext, event: MouseEvent): void;

    mouseUp(context: GameContext, event: MouseEvent): void;

    mouseWheel(context: GameContext, event: WheelEvent): void;

    tick(context: GameContext): void;

    render(context: GameContext, lag: number): void;
}