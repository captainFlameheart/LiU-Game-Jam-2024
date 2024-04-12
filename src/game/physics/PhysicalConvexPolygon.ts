class PhysicalPolygon {
    convexPolygon: TransformedConvexPolygon;
    material: Material;

    constructor(convexPolygon: TransformedConvexPolygon, material: Material) {
        this.convexPolygon = convexPolygon;
        this.material = material;
    }

    static of(convexPolygon: TransformedConvexPolygon, material: Material) {
        return new PhysicalPolygon(convexPolygon, material);
    }
}