class ConvexPolygon {
    vertices: Vector2D[];
    normals: Vector2D[];

    constructor(vertices: Vector2D[], normals: Vector2D[]) {
        this.vertices = vertices;
        this.normals = normals;
    }

    static computeNormals(vertices: Vector2D[], normals: Vector2D[]) {
        for (let i = 0; i < vertices.length; i++) {
            let j = (i + 1) % vertices.length;
            const normal = Vector2D.subtract(vertices[j], vertices[i]);
            normal.makePerpendicularClockwise();
            normal.normalize();
            normals[i] = normal;
        }
    }

    static of(vertices: Vector2D[]) {
        const normals = new Array(vertices.length);
        this.computeNormals(vertices, normals);
        return new ConvexPolygon(vertices, normals);
    }

    computeNormals() {
        ConvexPolygon.computeNormals(this.vertices, this.normals);
    }
}