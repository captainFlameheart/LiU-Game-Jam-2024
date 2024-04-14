function main() {
    
    
    /*const game = CartesianGameWrapper.of(SplitScreenGameWrapper.of(
        MainGame.of()
    ));*/
    
    
    const game = CartesianGameWrapper.of(EditorWrapper.of(
       LevelEditor.empty(), 
    ));
    

    
    const fps = 90;
    startGameLoop(game, fps);
}