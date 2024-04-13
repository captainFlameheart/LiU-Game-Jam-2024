interface SplitScreenGame {
    initialize(context: SplitScreenGameContext): Promise<void>;

    deltaTimeChanged(context: SplitScreenGameContext): void;    
    
    canvasResized(context: SplitScreenGameContext): void;
    
    playerConnected(context: SplitScreenGameContext, index: number): void;
    
    playerDisconnected(context: SplitScreenGameContext, index: number): void;
    
    mouseDown(context: SplitScreenGameContext, event: MouseEvent): void;
    
    mouseUp(context: SplitScreenGameContext, event: MouseEvent): void;
    
    mouseWheel(context: SplitScreenGameContext, event: WheelEvent): void;
    
    tick(context: SplitScreenGameContext): void;
    
    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number): void;
}