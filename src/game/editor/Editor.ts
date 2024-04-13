interface Editor {
    initialize(context: EditorContext): void;

    deltaTimeChanged(context: EditorContext): void;

    canvasResized(context: EditorContext): void;

    gamepadConnected(context: EditorContext, index: number): void;

    gamepadDisconnected(context: EditorContext, index: number): void;

    mouseDown(context: EditorContext, event: MouseEvent): void;

    mouseUp(context: EditorContext, event: MouseEvent): void;

    mouseWheel(context: EditorContext, event: WheelEvent): void;

    keyPressed(context: EditorContext, event: KeyboardEvent): void;

    keyReleased(context: EditorContext, event: KeyboardEvent): void;

    tick(context: EditorContext): void;

    render(context: EditorContext, lag: number, region: AABB): void;
}