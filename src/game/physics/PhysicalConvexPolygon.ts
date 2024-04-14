class PhysicalPolygon {
    convexPolygon: TransformedConvexPolygon;
    material: Material;
    categories: number;
    collidableCategories: number;

    constructor(
        convexPolygon: TransformedConvexPolygon, material: Material, 
        categories: number, collidableCategories: number
    ) {
        this.convexPolygon = convexPolygon;
        this.material = material;
        this.categories = categories;
        this.collidableCategories = collidableCategories;
    }

    static of(convexPolygon: TransformedConvexPolygon, material: Material) {
        const categories = 0xFFFFFFFF;
        const collidableCategories = 0xFFFFFFFF;
        return new PhysicalPolygon(
            convexPolygon, material, categories, collidableCategories
        );
    }

    static withCollisionFiltering(
        convexPolygon: TransformedConvexPolygon, material: Material, 
        categories: number, collidableCategories: number
    ) {
        return new PhysicalPolygon(
            convexPolygon, material, categories, collidableCategories
        );
    }
}