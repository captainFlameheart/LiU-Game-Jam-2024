function loadAudio(path: string): Promise<HTMLAudioElement> {
    return new Promise(
      (resolve, reject) => {
        var audio = new Audio(path);
        audio.addEventListener(
          "loadeddata", 
          function () {
            resolve(audio);
          });
      });
}
