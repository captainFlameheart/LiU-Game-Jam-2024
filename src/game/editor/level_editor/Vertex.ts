class Vertex {
    position: Vector2D;
    previous: number | null;
    next: number | null;

    constructor(
        position: Vector2D, 
        previous: number | null, 
        next: number | null, 
    ) {
        this.position = position;
        console.log(`Setting ${previous}`);
        this.previous = previous;
        this.next = next;
    }

    static of(
        position: Vector2D, 
        previous: number | null, 
        next: number | null, 
    ) {
        return new Vertex(position, previous, next);
    }
}