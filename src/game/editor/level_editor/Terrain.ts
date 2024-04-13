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

    log() {
        for (let i = 0; i < this.vertices.length; i++) {
            console.log(`${i}->${this.vertices[i].next}`);
        }
        for (let i = 0; i < this.vertices.length; i++) {
            console.log(`${this.vertices[i].previous}<-${i}`);
        }
    }
}