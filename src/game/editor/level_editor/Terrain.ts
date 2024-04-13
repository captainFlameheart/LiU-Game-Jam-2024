class Terrain {
    vertices: Vertex[];

    constructor(vertices: Vertex[]) {
        this.vertices = vertices;
    }

    static empty() {
        const vertices: Vertex[] = [];
        return new Terrain(vertices);
    }

    removeVertex(index: number) {
        const vertex = this.vertices[index];
        if (vertex.previous !== null) {
            this.vertices[vertex.previous].next = null;
        }
        if (vertex.next !== null) {
            this.vertices[vertex.next].previous = null;
        }
        this.vertices.splice(index, 1);
        for (const vertex of this.vertices) {
            if (vertex.previous !== null && vertex.previous > index) {
                vertex.previous--;
            }
            if (vertex.next !== null && vertex.next > index) {
                vertex.next--;
            }
        }
    }

    toArrays() {
        let res: [number, number][][] = [];
        let searched = new Set();

        for (let index = 0; index < this.vertices.length; index++) {
            if (searched.has(index)) continue;
            searched.add(index);

            let start = this.vertices[index];
            res.push([[start.position.getX(), start.position.getY()]]);

            let current = start;
            while (current.previous !== null && !searched.has(current.previous)) {
                searched.add(current.previous);
                current = this.vertices[current.previous];
                console.log(res.at(-1))
                res.at(-1)?.splice(0, 0, [current.position.getX(), current.position.getY()]);
                console.log(current.previous);
            }

            current = start;
            while (current.next !== null && !searched.has(current.next)) {
                searched.add(current.next);
                current = this.vertices[current.next];
                res.at(-1)?.push([current.position.getX(), current.position.getY()]);
            }
        }

        return res;

    }

    log() {
        for (let i = 0; i < this.vertices.length; i++) {
            console.log(`${i}->${this.vertices[i].next}`);
        }
        for (let i = 0; i < this.vertices.length; i++) {
            console.log(`${this.vertices[i].previous}<-${i}`);
        }
    }
}