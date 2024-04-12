class ContactManifold {
    contactPoints: ContactPoint[];
    normal: Vector2D;

    constructor(
        contactPoints: ContactPoint[], normal: Vector2D
    ) {
        this.contactPoints = contactPoints;
        this.normal = normal;
    }

    static of(
        contactPoints: ContactPoint[], normal: Vector2D
    ) {
        return new ContactManifold(contactPoints, normal);
    }
}