class LevelEditor implements Editor {
    static VERTEX_RADIUS = 0.02;
    static VERTEX_HOVER_SCALE = 2;

    terrain: Terrain;
    currentEndVertex: number | null;
    
    constructor(terrain: Terrain, currentEndVertex: number | null) {
        this.terrain = terrain;
        this.currentEndVertex = currentEndVertex;
    }

    static empty() {
        const currentEndVertex = null;
        return new LevelEditor(Terrain.empty(), currentEndVertex);
    }

    initialize(context: EditorContext): void {
    }

    findClosestVertexAnsSquareDistance(context: EditorContext) {
        if (this.terrain.vertices.length === 0) {
            return null;
        }
        const mousePosition = context.worldMousePosition;
        let closestVertex = 0;
        let closestDistance = Vector2D.computeSquareDistance(
            this.terrain.vertices[0].position, mousePosition
        );
        for (let i = 1; i < this.terrain.vertices.length; i++) {
            const distance = Vector2D.computeSquareDistance(
                this.terrain.vertices[i].position, mousePosition
            );
            if (distance < closestDistance) {
                closestVertex = i;
                closestDistance = distance;
            }
        }
        return [closestVertex, closestDistance];
    }

    findClosestVertex(context: EditorContext) {
        const result = this.findClosestVertexAnsSquareDistance(context);
        if (result === null) {
            return null;
        }
        return result[0];
    }

    findHoveredOverVertex(context: EditorContext) {
        const closestVertexAndSquareDistance = 
            this.findClosestVertexAnsSquareDistance(context);
        if (closestVertexAndSquareDistance === null) {
            return null;
        }
        const [closestVertex, squareDistance] = closestVertexAndSquareDistance;
        if (squareDistance < 
            LevelEditor.VERTEX_RADIUS * LevelEditor.VERTEX_RADIUS
        ) {
            return closestVertex;
        } else {
            return null;
        }
    }

    deltaTimeChanged(context: EditorContext): void {
    }

    canvasResized(context: EditorContext): void {
    }

    gamepadConnected(context: EditorContext, index: number): void {
    }

    gamepadDisconnected(context: EditorContext, index: number): void {
    }

    mouseDown(context: EditorContext, event: MouseEvent): void {
        if (event.button === 0) {
            const hoveredOverVertexIndex = this.findHoveredOverVertex(context);
            if (hoveredOverVertexIndex === null) {
                const newVertexIndex = this.terrain.vertices.length;
                const newVertex = Vertex.of(
                    context.worldMousePosition.copy(), this.currentEndVertex, null 
                );
                this.terrain.vertices.push(newVertex);
                if (this.currentEndVertex !== null) {
                    this.terrain.vertices[this.currentEndVertex].next = newVertexIndex;
                }
                this.currentEndVertex = newVertexIndex;
            } else {
                if (this.currentEndVertex === null) {
                    if (this.terrain.vertices[hoveredOverVertexIndex].next === null) {
                        this.currentEndVertex = hoveredOverVertexIndex;
                    }
                } else {
                    const hoveredOverVertex = this.terrain.vertices[hoveredOverVertexIndex];
                    if (hoveredOverVertex.previous === null) {
                        this.terrain.vertices[this.currentEndVertex].next = hoveredOverVertexIndex;
                        hoveredOverVertex.previous = this.currentEndVertex;
                        this.currentEndVertex = null;
                    }
                }
            }
        } else if (event.button === 2) {
            if (this.currentEndVertex === null) {
                const closestVertex = this.findClosestVertex(context);
                if (closestVertex !== null) {
                    this.terrain.removeVertex(closestVertex);
                    this.terrain.log();
                }
            }
        }
    }

    mouseUp(context: EditorContext, event: MouseEvent): void {
    }

    mouseWheel(context: EditorContext, event: WheelEvent): void {
    }

    keyPressed(context: EditorContext, event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                this.currentEndVertex = null;
                break;
        }
    }

    keyReleased(context: EditorContext, event: KeyboardEvent): void {
        console.log('key released!');
    }

    tick(context: EditorContext): void {
    }

    render(context: EditorContext, lag: number, region: AABB): void {
        const renderer = context.getRenderer();

        // Segments
        for (let vertexIndex = 0; vertexIndex < this.terrain.vertices.length; vertexIndex++) {
            const vertex = this.terrain.vertices[vertexIndex];
            if (vertex.next !== null) {
                renderer.beginPath();
                const start = vertex.position;
                const end = this.terrain.vertices[vertex.next].position;
                renderer.moveTo(start.x, start.y);
                renderer.lineTo(end.x, end.y);
                renderer.strokeStyle = 'black';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        }

        // Normals
        for (let vertexIndex = 0; vertexIndex < this.terrain.vertices.length; vertexIndex++) {
            const vertex = this.terrain.vertices[vertexIndex];
            if (vertex.next !== null) {
                renderer.beginPath();
                const start = vertex.position;
                const end = this.terrain.vertices[vertex.next].position;
                const edgeVector = Vector2D.subtract(end, start);
                const normal = Vector2D.perpendicularCounterClockwise(edgeVector);
                normal.normalize();
                const normalStart = Vector2D.addMultiplied(start, edgeVector, 0.5);
                const normalEnd = Vector2D.addMultiplied(normalStart, normal, 0.1);
                renderer.moveTo(normalStart.x, normalStart.y);
                renderer.lineTo(normalEnd.x, normalEnd.y);
                renderer.strokeStyle = 'orange';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        }

        // Vertices
        for (let i = 0; i < this.terrain.vertices.length; i++) { 
            const vertex = this.terrain.vertices[i];
            renderer.beginPath();
            renderer.arc(vertex.position.x, vertex.position.y, LevelEditor.VERTEX_RADIUS, 0, 2 * Math.PI);
            renderer.fillStyle = 'black';
            renderer.fill();
        }

        const hoveredOverVertexIndex = this.findHoveredOverVertex(context);
        if (hoveredOverVertexIndex !== null) {
            if (this.currentEndVertex === null) {
                const hoveredOverVertex = this.terrain.vertices[hoveredOverVertexIndex];
                if (hoveredOverVertex.next === null) {
                    renderer.beginPath();
                    renderer.arc(
                        hoveredOverVertex.position.x, hoveredOverVertex.position.y, 
                        LevelEditor.VERTEX_HOVER_SCALE * LevelEditor.VERTEX_RADIUS, 0, 2 * Math.PI
                    );
                    renderer.fillStyle = 'green';
                    renderer.fill();
                }
            } else {
                const hoveredOverVertex = this.terrain.vertices[hoveredOverVertexIndex];
                if (hoveredOverVertex.previous === null) {
                    renderer.beginPath();
                    renderer.arc(
                        hoveredOverVertex.position.x, hoveredOverVertex.position.y, 
                        LevelEditor.VERTEX_HOVER_SCALE * LevelEditor.VERTEX_RADIUS, 0, 2 * Math.PI
                    );
                    renderer.fillStyle = 'green';
                    renderer.fill();
                }
            }
        }

        // New segment
        if (this.currentEndVertex !== null) {
            renderer.beginPath();
            const start = this.terrain.vertices[this.currentEndVertex].position;
            const end = context.worldMousePosition;
            renderer.moveTo(start.x, start.y);
            renderer.lineTo(end.x, end.y);
            renderer.strokeStyle = 'green';
            renderer.stroke();
        }
    }
}