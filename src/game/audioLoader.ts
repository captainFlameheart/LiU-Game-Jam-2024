function loadAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise(resolve => {
        var audio = new Audio();
        audio.onload = function () {
            resolve(audio);
        };
        audio.src = path;
    });

    (HTMLAud | )
}