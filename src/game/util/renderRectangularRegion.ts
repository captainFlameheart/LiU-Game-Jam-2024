function renderRectangularRegion(
    renderer: CanvasRenderingContext2D, aspectRatio: number, 
    destinationTransform: CartesianTransform, 
    renderable: RectangularRegionRenderable, sourceTransform: CartesianTransform
) {
    const {
        position: destinationTranslation, scale: destinationScale
    } = destinationTransform;
    const {
        position: sourceTranslation, scale: sourceScale
    } = sourceTransform;

    renderer.save();
    renderer.translate(destinationTranslation.x, destinationTranslation.y);
    const relativeScale = destinationScale / sourceScale;
    renderer.scale(relativeScale, relativeScale);
    renderer.translate(-sourceTranslation.x, -sourceTranslation.y);
    const region = AABB.fromAspectRatioAndScale(
        sourceTranslation, aspectRatio, sourceScale
    );
    renderer.beginPath();
    const regionStart = region.start;
    const regionSize = region.computeSize();
    renderer.rect(regionStart.x, regionStart.y, regionSize.x, regionSize.y);
    renderer.clip();
    renderable.render(renderer, region);
    renderer.restore();
}