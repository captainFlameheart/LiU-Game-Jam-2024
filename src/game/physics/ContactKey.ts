class ContactKey {
    body0: number;
    shape0: number;
    body1: number;
    shape1: number;

    constructor(body0: number, shape0: number, body1: number, shape1: number) {
        this.body0 = body0;
        this.shape0 = shape0;
        this.body1 = body1;
        this.shape1 = shape1;
    }

    static of(body0: number, shape0: number, body1: number, shape1: number) {
        return new ContactKey(body0, shape0, body1, shape1);
    }

    static fromString(string: string) {
        const parts = string.split(' ');
        return new ContactKey(
            parseInt(parts[0]), parseInt(parts[1]), 
            parseInt(parts[2]), parseInt(parts[3])
        );
    }

    toString() {
        return `${this.body0} ${this.shape0} ${this.body1} ${this.shape1}`;
    }
}