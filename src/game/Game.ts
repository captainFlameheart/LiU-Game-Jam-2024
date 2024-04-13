interface Game {
    initialize(context: GameContext): Promise<null>;

    deltaTimeChanged(context: GameContext): void;

    canvasResized(context: GameContext): void;

    gamepadConnected(context: GameContext, index: number): void;

    gamepadDisconnected(context: GameContext, index: number): void;

    mouseMoved(context: GameContext, event: MouseEvent): void;

    mouseDown(context: GameContext, event: MouseEvent): void;

    mouseUp(context: GameContext, event: MouseEvent): void;

    mouseWheel(context: GameContext, event: WheelEvent): void;

    keyPressed(context: GameContext, event: KeyboardEvent): void;

    keyReleased(context: GameContext, event: KeyboardEvent): void;

    tick(context: GameContext): void;

    render(context: GameContext, lag: number): void;
}
