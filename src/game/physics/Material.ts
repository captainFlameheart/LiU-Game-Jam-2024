class Material {
    bounciness: number;
    friction: number;
    tangentSpeed: number;

    constructor(bounciness: number, friction: number, tangentSpeed: number) {
        this.bounciness = bounciness;
        this.friction = friction;
        this.tangentSpeed = tangentSpeed;
    }

    static of(bounciness: number, friction: number, tangentSpeed: number) {
        return new Material(bounciness, friction, tangentSpeed);
    }
}