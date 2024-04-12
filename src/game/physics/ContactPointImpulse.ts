class ContactPointImpulse {
    normalImpulse: number;
    tangentImpulse: number;

    constructor(normalImpulse: number, tangentImpulse: number) {
        this.normalImpulse = normalImpulse;
        this.tangentImpulse = tangentImpulse;
    }

    static of(normalImpulse: number, tangentImpulse: number) {
        return new ContactPointImpulse(normalImpulse, tangentImpulse);
    }

    static zero() {
        return new ContactPointImpulse(0, 0);
    }
}