class SplitScreenGameWrapper implements CartesianGame {
    static NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE = 
        'Split screen game context is null';

    splitScreenGame: SplitScreenGame;
    splitScreenGameContext: SplitScreenGameContext | null;

    constructor(
        splitScreenGame: SplitScreenGame, 
        splitScreenGameContext: SplitScreenGameContext | null
    ) {
        this.splitScreenGame = splitScreenGame;
        this.splitScreenGameContext = splitScreenGameContext;
    }

    static of(splitScreenGame: SplitScreenGame) {
        return new SplitScreenGameWrapper(splitScreenGame, null);
    }
    
    initialize(context: CartesianGameContext): void {
        this.splitScreenGameContext = 
            SplitScreenGameContext.of(context);
        this.splitScreenGame.initialize(this.splitScreenGameContext);
    }

    deltaTimeChanged(context: CartesianGameContext): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.deltaTimeChanged(this.splitScreenGameContext);
    }
    
    canvasResized(context: CartesianGameContext): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.canvasResized(this.splitScreenGameContext);
    }
    
    gamepadConnected(context: CartesianGameContext, index: number): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGameContext.gamepadConnected(index);
        this.splitScreenGame.playerConnected(
            this.splitScreenGameContext, index
        );
    }
    
    gamepadDisconnected(context: CartesianGameContext, index: number): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.playerDisconnected(
            this.splitScreenGameContext, index
        );
        this.splitScreenGameContext.gamepadDisconnected(index);
    }

    mouseMoved(context: CartesianGameContext, event: MouseEvent): void {
    }
    
    mouseDown(context: CartesianGameContext, event: MouseEvent): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.mouseDown(this.splitScreenGameContext, event);
    }
    
    mouseUp(context: CartesianGameContext, event: MouseEvent): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.mouseUp(this.splitScreenGameContext, event);
    }
    
    mouseWheel(context: CartesianGameContext, event: WheelEvent): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.mouseWheel(this.splitScreenGameContext, event);
    }
    
    tick(context: CartesianGameContext): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        this.splitScreenGame.tick(this.splitScreenGameContext);
    }

    keyPressed(context: CartesianGameContext, event: KeyboardEvent): void {
    }

    keyReleased(context: CartesianGameContext, event: KeyboardEvent): void {
    }
    
    render(context: CartesianGameContext, lag: number): void {
        if (this.splitScreenGameContext === null) {
            throw new Error(SplitScreenGameWrapper.NO_SPLIT_SCREEN_GAME_CONTEXT_MESSAGE);
        }
        
        const renderer = context.getRenderer();
        const playerContexts = this.splitScreenGameContext.playerContexts;
        const quadrantSize = context.getHalfSize();
        const aspectRatio = quadrantSize.computeAspectRatio();
        const quadrantHalfSize = Vector2D.halve(quadrantSize);
        const splitScreenGameRenderable = SplitScreenGameRenderable.of(
            this.splitScreenGame, this.splitScreenGameContext, lag
        );
        let i = 0;
        playerContexts.forEach((playerContext) => {
            const quadrantPosition = Vector2D.cartesian(
                (2 * (i % 2) - 1) * quadrantHalfSize.x, 
                (1 - 2 * Math.trunc(i / 2)) * quadrantHalfSize.y
            );
            const quadrantScale = quadrantHalfSize.y;
            renderRectangularRegion(
                context.getRenderer(), aspectRatio, 
                CartesianTransform.of(quadrantPosition, quadrantScale), 
                splitScreenGameRenderable, playerContext.camera
            )
            i++;
        });

        renderer.beginPath();
        renderer.moveTo(-quadrantSize.x, 0);
        renderer.lineTo(quadrantSize.x, 0);
        renderer.moveTo(0, -quadrantSize.y);
        renderer.lineTo(0, quadrantSize.y);
        renderer.strokeStyle = 'black';
        renderer.lineWidth = 5;
        renderer.stroke();
    }
}