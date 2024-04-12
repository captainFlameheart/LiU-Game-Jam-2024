class SplitScreenGameRenderable implements RectangularRegionRenderable {
    splitScreenGame: SplitScreenGame;
    splitScreenGameContext: SplitScreenGameContext;
    lag: number;

    constructor(
        splitScreenGame: SplitScreenGame, 
        splitScreenGameContext: SplitScreenGameContext, 
        lag: number
    ) {
        this.splitScreenGame = splitScreenGame;
        this.splitScreenGameContext = splitScreenGameContext;
        this.lag = lag;
    }

    static of(splitScreenGame: SplitScreenGame, 
        splitScreenGameContext: SplitScreenGameContext, 
        lag: number
    ) {
        return new SplitScreenGameRenderable(
            splitScreenGame, splitScreenGameContext, lag
        );
    }
    
    render(renderer: CanvasRenderingContext2D, region: AABB): void {
        this.splitScreenGame.render(this.splitScreenGameContext, region, this.lag);
    }
}