class ContactPointManifoldExtension {
    displacement0: Vector2D;
    displacement1: Vector2D;
    normalMass: number;
    tangentMass: number;

    constructor(
        displacement0: Vector2D, displacement1: Vector2D, 
        normalMass: number, tangentMass: number
    ) {
        this.displacement0 = displacement0;
        this.displacement1 = displacement1;
        this.normalMass = normalMass;
        this.tangentMass = tangentMass;
    }

    static of(
        displacement0: Vector2D, displacement1: Vector2D, 
        normalMass: number, tangentMass: number
    ) {
        return new ContactPointManifoldExtension(
            displacement0, displacement1, 
            normalMass, tangentMass
        );
    }
}