class CameraMouseController {
    camera: CartesianTransform;
    grabbedPosition: Vector2D | null;

    constructor(camera: CartesianTransform, grabbedPosition: Vector2D | null) {
        this.camera = camera;
        this.grabbedPosition = grabbedPosition;
    }

    static of(camera: CartesianTransform) {
        const grabbedPosition = null;
        return new CameraMouseController(camera, grabbedPosition);
    }

    mouseDown(mousePosition: Vector2D) {
        this.grabbedPosition = this.camera.localToGlobalPosition(
            mousePosition
        );
        console.log(`Grabbed (${this.grabbedPosition.x}, ${this.grabbedPosition.y})`);
    }

    mouseMoved(worldMousePosition: Vector2D) {
        if (this.grabbedPosition !== null) {
            const translation = Vector2D.subtract(
                this.grabbedPosition, worldMousePosition
            );
            this.camera.position.add(translation);
        }
    }

    mouseUp() {
        this.grabbedPosition = null;
    }

    mouseWheel(event: WheelEvent) {
        const scaleFactor = 1.001;
        this.camera.scale *= (Math.pow(scaleFactor, event.deltaY));
    }
}