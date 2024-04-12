function checkCanvasSize(game: Game, canvas: HTMLCanvasElement, gameContext: GameContext) {
    if (canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.canvasResized(gameContext);
    }
}

function step(
    game: Game, canvas: HTMLCanvasElement, renderer: CanvasRenderingContext2D, gameContext: GameContext, 
    tickDeltaTimeSeconds: number, tickDeltaTimeMilliseconds: number, 
    processedMilliseconds: number, currentMilliseconds: number 
) {
    checkCanvasSize(game, canvas, gameContext);

    const newGamepads = navigator.getGamepads();
    const oldIndicies = getGamepadIndicies(gameContext.gamepads);
    const newIndicies = getGamepadIndicies(newGamepads);
    newIndicies.forEach((newIndex) => {
        if (oldIndicies.has(newIndex)) {
            oldIndicies.delete(newIndex);
        } else {
            game.gamepadConnected(gameContext, newIndex);
        }
    });
    oldIndicies.forEach((oldIndex) => {
        game.gamepadDisconnected(gameContext, oldIndex);
    });
    gameContext.gamepads = newGamepads;

    let lagMilliseconds;
    while (
        (lagMilliseconds = (currentMilliseconds - processedMilliseconds)) > 
        tickDeltaTimeMilliseconds
    ) {
        game.tick(gameContext);
        processedMilliseconds += tickDeltaTimeMilliseconds;
    }

    const lagSeconds = 0.001 * lagMilliseconds;
    game.render(gameContext, lagSeconds);

    requestAnimationFrame((currentMilliseconds) => step(
        game, canvas, renderer, gameContext, 
        tickDeltaTimeSeconds, tickDeltaTimeMilliseconds, 
        processedMilliseconds, currentMilliseconds
    ));
}

function getGamepadIndicies(gamepads: (Gamepad | null)[]) {
    const indices = new Set<number>();
    for (const gamepad of gamepads) {
        if (gamepad !== null) {
            indices.add(gamepad.index);
        }
    }
    return indices;
}

function startGameLoop(game: Game, fps: number) {
    const tickDeltaTimeSeconds = 1 / fps;
    const tickDeltaTimeMilliseconds = 1000 * tickDeltaTimeSeconds;

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const renderer = canvas.getContext('2d') as CanvasRenderingContext2D;
    const gameContext = GameContext.of(renderer, tickDeltaTimeSeconds);
    if (renderer === null) {
        throw new Error('Failed to get renderer');
    }
    
    game.initialize(gameContext);
    game.deltaTimeChanged(gameContext);
    checkCanvasSize(game, canvas, gameContext);

    window.onmousedown = (event) => {
        game.mouseDown(gameContext, event);
    }

    window.onmouseup = (event) => {
        game.mouseUp(gameContext, event);
    };

    window.onwheel = (event) => {
        game.mouseWheel(gameContext, event);
    };

    const lag = 0.0;
    game.render(gameContext, lag);
    const processedMilliseconds = 0.0;
    requestAnimationFrame((currentMillisecond) => step(
        game, canvas, renderer, gameContext, 
        tickDeltaTimeSeconds, tickDeltaTimeMilliseconds, 
        processedMilliseconds, currentMillisecond
    ));
}
