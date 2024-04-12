function main() {
    const game = CartesianGameWrapper.of(SplitScreenGameWrapper.of(
        MainGame.of()
    ));
    const fps = 240;
    startGameLoop(game, fps);
}