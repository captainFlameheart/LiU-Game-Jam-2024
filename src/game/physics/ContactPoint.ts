class ContactPoint {
    position: Vector2D;
    penetration: number;

    constructor(position: Vector2D, penetration: number) {
        this.position = position;
        this.penetration = penetration;
    }

    static of(position: Vector2D, penetration: number) {
        return new ContactPoint(position, penetration);
    }
}