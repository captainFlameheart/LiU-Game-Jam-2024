class EditorRenderable implements RectangularRegionRenderable {
    editor: Editor;
    editorContext: EditorContext;
    lag: number;

    constructor(
        levelEditor: Editor, levelEditorContext: EditorContext, 
        lag: number
    ) {
        this.editor = levelEditor;
        this.editorContext = levelEditorContext;
        this.lag = 0.0;
    }

    static of(
        levelEditor: Editor, levelEditorContext: EditorContext, 
        lag: number
    ) {
        return new EditorRenderable(levelEditor, levelEditorContext, lag);
    }

    renderBackground(renderer: CanvasRenderingContext2D, region: AABB) {
        const start = region.start;
        const size = region.computeSize();
        renderer.fillStyle = 'white';
        renderer.fillRect(start.x, start.y, size.x, size.y);
    }

    renderGrid(renderer: CanvasRenderingContext2D, region: AABB) {
        renderer.beginPath();
        for (let y = Math.floor(region.start.y); y < Math.ceil(region.end.y); y++) {
            renderer.moveTo(region.start.x, y);
            renderer.lineTo(region.end.x, y);
        }
        for (let x = Math.floor(region.start.x); x < Math.ceil(region.end.x); x++) {
            renderer.moveTo(x, region.start.y);
            renderer.lineTo(x, region.end.y);
        }
        renderer.strokeStyle = 'gray';
        renderer.lineWidth = 0.01;
        renderer.stroke();
    }

    render(renderer: CanvasRenderingContext2D, region: AABB): void {
        this.renderBackground(renderer, region);
        this.renderGrid(renderer, region);
        this.editor.render(this.editorContext, this.lag, region);
    }
}