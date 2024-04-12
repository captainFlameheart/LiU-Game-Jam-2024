function centerAndFlip(renderer: CanvasRenderingContext2D) {
    const canvas = renderer.canvas;
    const halfCanvasWidth = 0.5 * canvas.width;
    const halfCanvasHeight = 0.5 * canvas.height;
    renderer.translate(halfCanvasWidth, halfCanvasHeight);
    renderer.scale(1, -1);
}