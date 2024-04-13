class SplitScreenGameRenderable implements RectangularRegionRenderable {
    splitScreenGame: SplitScreenGame;
    splitScreenGameContext: SplitScreenGameContext;
    lag: number;
    playerIndex: number;

    constructor(
        splitScreenGame: SplitScreenGame, 
        splitScreenGameContext: SplitScreenGameContext, 
        lag: number, playerIndex: number
    ) {
        this.splitScreenGame = splitScreenGame;
        this.splitScreenGameContext = splitScreenGameContext;
        this.lag = lag;
        this.playerIndex = playerIndex;
    }

    static of(splitScreenGame: SplitScreenGame, 
        splitScreenGameContext: SplitScreenGameContext, 
        lag: number, playerIndex: number
    ) {
        return new SplitScreenGameRenderable(
            splitScreenGame, splitScreenGameContext, lag, playerIndex
        );
    }
    
    render(renderer: CanvasRenderingContext2D, region: AABB): void {
        this.splitScreenGame.render(this.splitScreenGameContext, region, this.lag, this.playerIndex);
    }
}