class AABB {
    start: Vector2D;
    end: Vector2D;

    constructor(start: Vector2D, end: Vector2D) {
        this.start = start;
        this.end = end;
    }

    static of(start: Vector2D, end: Vector2D) {
        return new AABB(start, end);
    }

    static fromAspectRatioAndScale(
        center: Vector2D, aspectRatio: number, scale: number
    ) {
        const halfSize = Vector2D.cartesian(aspectRatio * scale, scale);
        return new AABB(
            Vector2D.subtract(center, halfSize), 
            Vector2D.add(center, halfSize)
        );
    }

    computeSize() {
        return Vector2D.subtract(this.end, this.start);
    }
}