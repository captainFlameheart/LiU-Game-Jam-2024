class TransformedConvexPolygon {
    localVertices: Vector2D[];
    globalPolygon: ConvexPolygon;

    constructor(
        localVertices: Vector2D[], 
        globalPolygon: ConvexPolygon
    ) {
        this.localVertices = localVertices;
        this.globalPolygon = globalPolygon;
    }

    static of(localVertices: Vector2D[]) {
        const globalVertices = new Array(localVertices.length);
        for (let i = 0; i < localVertices.length; i++) {
            globalVertices[i] = localVertices[i].copy();
        }
        const globalPolygon = ConvexPolygon.of(globalVertices);
        return new TransformedConvexPolygon(localVertices, globalPolygon);
    }
    
    transform(body: Body) {
        const translation = body.position;
        const angle = body.angle;
        for (let i = 0; i < this.localVertices.length; i++) {
            this.globalPolygon.vertices[i] = Vector2D.add(
                translation, Vector2D.rotate(this.localVertices[i], angle)
            );
        }
        this.globalPolygon.computeNormals();
    }
}
