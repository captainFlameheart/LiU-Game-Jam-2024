class EditorWrapper implements CartesianGame {
    editor: Editor;
    editorContext: EditorContext | null;
    cameraMouseController: CameraMouseController | null;
    
    constructor(
        editor: Editor, editorContext: EditorContext | null, 
        cameraMouseController: CameraMouseController | null
    ) {
        this.editor = editor;
        this.editorContext = editorContext;
        this.cameraMouseController = cameraMouseController;
    }

    static of(editor: Editor) {
        const editorContext = null;
        const cameraMouseController = null;
        return new EditorWrapper(
            editor, editorContext, cameraMouseController);
    }

    initialize(context: CartesianGameContext): void {
        const camera = CartesianTransform.of(Vector2D.zero(), 1);
        const worldMousePosition = Vector2D.zero();
        this.editorContext = EditorContext.of(
            context, camera, worldMousePosition
        );
        this.cameraMouseController = CameraMouseController.of(camera);
        this.editor.initialize(this.editorContext);
    }

    requireEditorContext() {
        if (this.editorContext === null) {
            throw new Error('Editor context is null');
        }
        return this.editorContext;
    }

    requireMouseController() {
        if (this.cameraMouseController === null) {
            throw new Error('Mouse controller is null');
        }
        return this.cameraMouseController;
    }

    deltaTimeChanged(context: CartesianGameContext): void {
        this.editor.deltaTimeChanged(this.requireEditorContext());
    }

    canvasResized(context: CartesianGameContext): void {
        this.editor.canvasResized(this.requireEditorContext());
    }

    gamepadConnected(context: CartesianGameContext, index: number): void {
        this.editor.gamepadConnected(this.requireEditorContext(), index);
    }

    gamepadDisconnected(context: CartesianGameContext, index: number): void {
        this.editor.gamepadDisconnected(this.requireEditorContext(), index);
    }

    computeCameraLocalMousePosition(context: CartesianGameContext) {
        const editorContext = this.requireEditorContext();
        const halfHeight = context.getHalfSize().y;
        return Vector2D.divide(
            context.cartesianMousePosition, halfHeight
        );
    }

    mouseMoved(context: CartesianGameContext, event: MouseEvent) {
        const editorContext = this.requireEditorContext();
        const cameraLocalMousePosition = this.computeCameraLocalMousePosition(
            context
        );
        editorContext.worldMousePosition = editorContext.camera.
            localToGlobalPosition(
                cameraLocalMousePosition
            );

        this.requireMouseController().mouseMoved(editorContext.worldMousePosition);
    }

    mouseDown(context: CartesianGameContext, event: MouseEvent): void {
        if (event.button === 1) {
            const mouseController = this.requireMouseController();
            const editorContext = this.requireEditorContext();
            mouseController.mouseDown(this.computeCameraLocalMousePosition(
                context
            ));
        } else {
            this.editor.mouseDown(this.requireEditorContext(), event);
        }
    }

    mouseUp(context: CartesianGameContext, event: MouseEvent): void {
        if (event.button === 1) {
            this.requireMouseController().mouseUp();
            this.editor.mouseUp(this.requireEditorContext(), event);
        }
    }

    mouseWheel(context: CartesianGameContext, event: WheelEvent): void {
        this.editor.mouseWheel(this.requireEditorContext(), event);
        this.requireMouseController().mouseWheel(event);
    }

    keyPressed(context: CartesianGameContext, event: KeyboardEvent): void {
        this.editor.keyPressed(this.requireEditorContext(), event);
    }

    keyReleased(context: CartesianGameContext, event: KeyboardEvent): void {
        this.editor.keyReleased(this.requireEditorContext(), event);
    }

    tick(context: CartesianGameContext): void {
        this.editor.tick(this.requireEditorContext());
    }

    render(context: CartesianGameContext, lag: number): void {
        const renderer = context.getRenderer();
        const aspectRatio = context.getHalfSize().computeAspectRatio();
        const destinationTransform = CartesianTransform.of(
            Vector2D.zero(), context.getHalfSize().y
        );
        renderRectangularRegion(
            renderer, aspectRatio, destinationTransform, 
            EditorRenderable.of(this.editor, this.requireEditorContext(), lag), 
            this.requireEditorContext().camera
        );
    }
}