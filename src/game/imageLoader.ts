function loadImage(path: string): Promise<ImageBitmap> {
    return new Promise(resolve => {
        var image = new Image();
        image.onload = function() {
            resolve(createImageBitmap(image));
        };
        image.src = path;
    });
}