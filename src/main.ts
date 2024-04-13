function main() {
    const game = CartesianGameWrapper.of(SplitScreenGameWrapper.of(
        MainGame.of()
    ));
    const fps = 60;
    startGameLoop(game, fps);
}