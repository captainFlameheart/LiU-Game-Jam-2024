class CameraViewRectangle {
    camera: CartesianTransform;
    rectangle: AABB;
    
    constructor(camera: CartesianTransform, rectangle: AABB) {
        this.camera = camera;
        this.rectangle = rectangle;
    }
}