class CartesianGameWrapper implements Game {
    static NO_CARTESIAN_GAME_CONTEXT_MESSAGE = 'Cartesian game context is null';

    cartesianGame: CartesianGame;
    cartesianGameContext: CartesianGameContext | null;

    constructor(
        cartesianGame: CartesianGame, 
        cartesianGameContext: CartesianGameContext | null
    ) {
        this.cartesianGame = cartesianGame;
        this.cartesianGameContext = cartesianGameContext;
    }

    static of(cartesianGame: CartesianGame) {
        return new CartesianGameWrapper(cartesianGame, null);
    }

    initialize(context: GameContext): Promise<null> {
        this.cartesianGameContext = CartesianGameContext.fromGameContext(context);
        this.cartesianGame.initialize(this.cartesianGameContext);
        return new Promise(resolve => resolve(null));
    }

    requireCartesianGameContext() {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        return this.cartesianGameContext;
    }
    
    deltaTimeChanged(context: GameContext): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.deltaTimeChanged(this.cartesianGameContext);
    }

    canvasResized(context: GameContext): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGameContext.halfSize = context.computeHalfSize();
        this.cartesianGame.canvasResized(this.cartesianGameContext);
    }

    gamepadConnected(context: GameContext, index: number): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.gamepadConnected(this.cartesianGameContext, index);
    }

    gamepadDisconnected(context: GameContext, index: number): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.gamepadDisconnected(this.cartesianGameContext, index);
    }

    mouseMoved(context: GameContext, event: MouseEvent): void {
        const cartesianGameContext = this.requireCartesianGameContext();
        cartesianGameContext.cartesianMousePosition = 
            Vector2D.subtract(
                context.mousePosition, 
                cartesianGameContext.getHalfSize()
            );
        cartesianGameContext.cartesianMousePosition.y *= -1;
        this.cartesianGame.mouseMoved(cartesianGameContext, event);
    }

    mouseDown(context: GameContext, event: MouseEvent): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.mouseDown(this.cartesianGameContext, event);
    }

    mouseUp(context: GameContext, event: MouseEvent): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.mouseUp(this.cartesianGameContext, event);
    }

    mouseWheel(context: GameContext, event: WheelEvent): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.mouseWheel(this.cartesianGameContext, event);
    }

    keyPressed(context: GameContext, event: KeyboardEvent): void {
        this.cartesianGame.keyPressed(this.requireCartesianGameContext(), event);
    }

    keyReleased(context: GameContext, event: KeyboardEvent): void {
        this.cartesianGame.keyReleased(this.requireCartesianGameContext(), event);
    }

    tick(context: GameContext): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        this.cartesianGame.tick(this.cartesianGameContext);
    }

    render(context: GameContext, lag: number): void {
        if (this.cartesianGameContext === null) {
            throw new Error(CartesianGameWrapper.NO_CARTESIAN_GAME_CONTEXT_MESSAGE);
        }
        const renderer = context.renderer;
        
        renderer.save();
        const halfSize = this.cartesianGameContext.getHalfSize();
        renderer.translate(halfSize.x, halfSize.y);
        renderer.scale(1, -1);
        this.cartesianGame.render(this.cartesianGameContext, lag);
        renderer.restore();
    }
}