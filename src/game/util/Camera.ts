class CartesianTransform {
    position: Vector2D;
    scale: number;
    
    constructor(position: Vector2D, scale: number) {
        this.position = position;
        this.scale = scale;
    }

    static of(position: Vector2D, scale: number) {
        return new CartesianTransform(position, scale);
    }

    localToGlobalPosition(localPosition: Vector2D) {
        return Vector2D.add(this.position, 
            Vector2D.multiply(localPosition, this.scale)
        );
    }

    transformAsCamera(renderer: CanvasRenderingContext2D) {
        renderer.scale(this.scale, this.scale);
        renderer.translate(-this.position.x, -this.position.y);
    }
}