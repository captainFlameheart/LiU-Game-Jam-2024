interface RectangularRegionRenderable {
    render(renderer: CanvasRenderingContext2D, region: AABB): void;
}