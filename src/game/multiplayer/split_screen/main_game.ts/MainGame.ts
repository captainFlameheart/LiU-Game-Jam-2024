

class MainGame implements SplitScreenGame {
    static THUMBSTICK_DEAD_ZONE = 0.1;
    static MAX_PLAYERS: number = 4;

    hatImage: ImageBitmap | null;
    goatScream: HTMLAudioElement | null;
    smackSound: HTMLAudioElement | null;
    music: HTMLAudioElement | null;
    snowImage: ImageBitmap | null;

    winner: number = 5;
      
    physicsEngine: PhysicsEngine;
    frameRateMeasurementStartTime: number = Date.now();
    frameRateMeasurmentCounter: number = 0;

    particleSystem: ParticleSystem;

    playerHats: Map<number, Hat> = new Map<number, Hat>();
    snow: Snow[] = [];

    goat: Goat;
    nGon: NGon|null;
    map: MountainMap|null;

    ready: Array<boolean> = Array(MainGame.MAX_PLAYERS);
    
    aButtonPressedLast: Array<boolean> = Array(MainGame.MAX_PLAYERS);
    aButtonChanged: Array<boolean> = Array(MainGame.MAX_PLAYERS);
    bButtonPressedLast: Array<boolean> = Array(MainGame.MAX_PLAYERS);
    bButtonChanged: Array<boolean> = Array(MainGame.MAX_PLAYERS);

    hasPlayer: boolean = false;
    inGame: boolean = false;

    constructor(
        physicsEngine: PhysicsEngine, hatImage: ImageBitmap | null, 
        goatScream: HTMLAudioElement | null, smackSound: HTMLAudioElement | null,
        music:  HTMLAudioElement | null, goat: Goat, snowImage: ImageBitmap | null
    ) {
        this.map = null;
        this.nGon = null;
        this.physicsEngine = physicsEngine;
        this.hatImage = hatImage;
        this.goatScream = goatScream;
        this.smackSound = smackSound;
        this.music = music;
        this.goat = goat;
        this.snowImage = snowImage
        for (let i = 0; i < MainGame.MAX_PLAYERS; i++) {
            this.ready[i] = this.aButtonPressedLast[i] = this.aButtonChanged[i] = false;
        }

        this.particleSystem = new ParticleSystem([]);
    }

    static of() {
        const hatImage = null;
        const goatScream = null;
        const smackSound = null;
        const music = null;
        const snowImage = null;
        const goat = Goat.of();
        return new MainGame(PhysicsEngine.of(), hatImage, goatScream, smackSound, music, goat, snowImage);
    }

    loadAssets(context: SplitScreenGameContext): Promise<void> {
        const promised_hat: Promise<void | ImageBitmap> = loadImage('../images/hat.png').then(hatImage => {
          this.hatImage = hatImage;
        });

        const promised_snow: Promise<void | ImageBitmap> = loadImage('../images/edvard.png').then(snowImage => {
          this.snowImage = snowImage;
        });

        const promised_goat_scream: Promise<void | HTMLAudioElement> = loadAudio('../audio/goat_scream.wav').then(goatScream => {
          this.goatScream = goatScream;
          this.goatScream.volume = 0.30;
        });

        const promised_smack: Promise<void | HTMLAudioElement> = loadAudio('../audio/smack.wav').then(smackSound => {
          this.smackSound = smackSound;
        });

        const promised_music: Promise<void | HTMLAudioElement> = loadAudio('../audio/Spazzmatica Polka.mp3').then(music => {
          this.music = music;
          this.music.volume = 0.7;
          this.music.loop = true;
        });

        return Promise.all([promised_hat, promised_snow, promised_goat_scream, promised_smack]).then();
    }


    requireNGon(){
        if (this.nGon === null){
            throw new Error("NGon is null");
        }
        return this.nGon;
    }
    requireMap(){
        if (this.map === null){
            throw new Error("map is null");
        }
        return this.map;
    }

    initialize(context: SplitScreenGameContext): Promise<void> {

        const map = new MountainMap("", this);
        this.map = map;

        this.nGon = new NGon(this);
        //this.nGon.initialize(5, 0.2, new Vector2D(0, 0));

        return this.loadAssets(context).then(
        ).then(() => {
            this.physicsEngine.setDeltaTime(context.getTickDeltaTime());
            this.goat.initialize(this, context)
            
            const material0 = Material.of(0.0, 0.3, 0.0);
            const localPolygon0 = [
                //Vector2D.cartesian(1, 1), 
                Vector2D.cartesian(-1, 0), 
                Vector2D.cartesian(-10, -10), 
                Vector2D.cartesian(100, -100),
                Vector2D.cartesian(2, -1)
            ];
            const localPolygon1 = [
                Vector2D.cartesian(1, 1), 
                Vector2D.cartesian(-1, 1), 
                Vector2D.cartesian(-1, -1), 
            ];

        this.snow.push(Snow.letItSnow(context, 2, 0.1, 3, 0.5, this.snowImage as ImageBitmap))
        this.snow.push(Snow.letItSnow(context, 3, 0.1, 5, 1, this.snowImage as ImageBitmap))
        //this.snow.push(Snow.letItSnow(context, 1, 0.1, 1, 0.75))    
        


            const body0 = Body.of(this.physicsEngine);
            body0.position.set(Vector2D.cartesian(0.01, 5));
            body0.setTrueVelocity(Vector2D.cartesian(0, 0));
            body0.setTrueAcceleration(Vector2D.cartesian(0, -9.81));
            body0.angularLightness = 0.4;
            body0.polygons.push(PhysicalPolygon.of(
                TransformedConvexPolygon.of(localPolygon1), 
                material0
            ));
            //this.physicsEngine.bodies.push(body0);

            const body1 = Body.of(this.physicsEngine);
            body1.lightness = 0.0;
            body1.angularLightness = 0.0;
            body1.polygons.push(PhysicalPolygon.of(
                TransformedConvexPolygon.of(localPolygon0), 
                material0
            ));
            //this.physicsEngine.bodies.push(body1);
        });
    }

    requireHatImage() {
        if (this.hatImage === null) {
            throw new Error('Hat image is null');
        }
        return this.hatImage;
    }

    getMaxPlayers(context: SplitScreenGameContext ) {
        return context.playerContexts.size
    }

    deltaTimeChanged(context: SplitScreenGameContext): void {
        this.physicsEngine.setDeltaTime(context.getTickDeltaTime());
    }

    canvasResized(context: SplitScreenGameContext): void {
    }


    assignHatToPlayer(playerIndex: number, hat: Hat) {
        this.playerHats.set(playerIndex, hat);
    }

    playerConnected(context: SplitScreenGameContext, index: number): void {
        console.log(`Player ${index} connected!`);
        context.getPlayerContext(index).camera.scale = 10;

        const newHat = new Hat(this, index);
        newHat.initialize(1, 1.3, 0, 0);  // Parameters can be adjusted as needed
        this.assignHatToPlayer(index, newHat);
    }

    playerDisconnected(context: SplitScreenGameContext, index: number): void {
        console.log(`Player ${index} disconnected!`);
    }

    mouseDown(context: SplitScreenGameContext, event: MouseEvent): void {
    }

    mouseUp(context: SplitScreenGameContext, event: MouseEvent): void {
    }

    mouseWheel(context: SplitScreenGameContext, event: WheelEvent): void {
    
    }

    getHatForPlayer(playerIndex: number): Hat | undefined {
        return this.playerHats.get(playerIndex);
    }

    ForcesToNGone() {

        const nGon = this.goat.head.requireBody(); 


        nGon.setTrueAcceleration(Vector2D.cartesian(0,-10));

        let resultantVector = new Vector2D(0, 0);
        this.playerHats.forEach((hat) => {
            if (hat && this.nGon) {
                const vectorToHat = Vector2D.fromPoints(nGon.position, hat.body.position);
                resultantVector.add(vectorToHat);
            }
        });

        resultantVector.normalize()

        nGon.Force(Vector2D.multiply(resultantVector,4));  // Assuming NGon's body has an applyForce method

    }

    tick(context: SplitScreenGameContext): void {

        //const nGon = this.requireNGon();
        //nGon.tick(context);  

        this.ForcesToNGone();


        const map = this.requireMap()

        map.tick(context, 50);


        if (!this.inGame) {
            const anyAReleased = this.aButtonChanged.reduce((prev, current, i) => {
                return prev || (current && !context.aButtonPressed(i));
            }, false);
            if (this.hasPlayer && anyAReleased) {
                let nReady = 0;
                console.log(context.playerContexts.size, this.aButtonChanged);
                context.playerContexts.forEach((playerContext, i) => {
                    this.ready[i] ||= !context.aButtonPressed(i);
                    nReady += Number(this.ready[i]);
                });


                this.inGame ||= nReady > 0 && nReady == context.playerContexts.size;
                if (this.inGame) this.music?.play();
            }

            let pressedA = Array<boolean>(MainGame.MAX_PLAYERS);
            context.playerContexts.forEach((playerContext, i) => {
                pressedA[i] = context.aButtonPressed(i);
                this.aButtonChanged[i] = this.aButtonPressedLast[i] != pressedA[i];
                this.aButtonPressedLast[i] = pressedA[i];
                this.hasPlayer ||= true;
            });
            return;
        }
            
        //console.log(this.ready);

        const currentTime = Date.now();
        if (currentTime - this.frameRateMeasurementStartTime >= 1000) {
            //console.log(`fps: this.count`);
            this.frameRateMeasurmentCounter = 0;
            this.frameRateMeasurementStartTime = currentTime;
        } else {
            this.frameRateMeasurmentCounter++;
        }

        this.physicsEngine.tick();

        this.particleSystem.tick(context, this);

        this.snow.forEach(snow => {
            snow.tick()
        })

        const deltaTime = context.getTickDeltaTime();

        context.playerContexts.forEach((playerContext, playerIndex) => {
            const leftThumbstickVector = context.getLeftThumbstickVector(
                playerIndex
            );
            leftThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );
            playerContext.camera.position.addMultiplied(
                leftThumbstickVector, 10 * deltaTime
            );
            const rightThumbstickVector = context.getRightThumbstickVector(
                playerIndex
            );
            rightThumbstickVector.clampToZeroIfLengthLessThan(
                MainGame.THUMBSTICK_DEAD_ZONE
            );

            const hat = this.getHatForPlayer(playerIndex);
            if (hat) {
                hat.tick(context); 
                playerContext.camera.position.x = hat.body.position.x;
                playerContext.camera.position.y = hat.body.position.y;
            }

            playerContext.camera.scale *= Math.pow(
                10, -rightThumbstickVector.y * deltaTime
            );
        });
    }

    isPlayerTouchingBody(playerIndex: number, targetBody: Body): boolean {
        let hat = this.getHatForPlayer(playerIndex); // Assuming getHatForPlayer returns the hat object

        if (!hat) {
            return false; // No hat found for the given player
        }

        let isTouching = false;
        this.physicsEngine.contactConstraints.forEach((contactConstraint: ContactConstraint, contactKeyString: string) => {
            const contact_info = ContactKey.fromString(contactKeyString);

            // Check for contact between the hat's body and the target body
            if ((this.physicsEngine.bodies[contact_info.body0] === hat.body && this.physicsEngine.bodies[contact_info.body1] === targetBody) || 
                (this.physicsEngine.bodies[contact_info.body1] === hat.body && this.physicsEngine.bodies[contact_info.body0] === targetBody)) {
                isTouching = true;
            }
        });

        return isTouching;
    }

    renderBackground(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        renderer.fillStyle = 'cyan';
        const start = region.start;
        const size = region.computeSize();
        renderer.fillRect(start.x, start.y, size.x, size.y);
    }

    renderHouse(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        
        renderer.beginPath();
        renderer.rect(-0.5, -0.5, 1, 1);
        renderer.fillStyle = 'rgb(252, 231, 164)';
        renderer.fill();
        
        renderer.beginPath();
        renderer.moveTo(0, 1);
        renderer.lineTo(0.7, 0.5);
        renderer.lineTo(-0.7, 0.5);
        renderer.closePath();
        renderer.fillStyle = 'brown';
        renderer.fill();
    }

    renderCameras(context: SplitScreenGameContext, region: AABB, lag: number) {
        const renderer = context.getRenderer();
        renderer.strokeStyle = 'black';
        renderer.lineWidth = 0.1;
        context.playerContexts.forEach((playerContext, playerIndex) => {
            renderer.save();
            const camera = playerContext.camera;
            const translation = camera.position;
            const scale = 0.1 * camera.scale;
            renderer.translate(translation.x, translation.y);
            renderer.scale(scale, scale);
            renderer.beginPath();
            renderer.moveTo(-1, 0);
            renderer.lineTo(1, 0);
            renderer.moveTo(0, -1);
            renderer.lineTo(0, 1);
            //renderer.stroke();
            renderer.restore();
        });
    }

    static addPolygon(renderer: CanvasRenderingContext2D, vertices: Vector2D[]) {
        renderer.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            renderer.lineTo(vertices[i].x, vertices[i].y);
        }
        renderer.closePath();
    }

    renderBodies(context: SplitScreenGameContext, region: AABB, lag: number): void {
        const renderer = context.getRenderer();
        for (const body of this.physicsEngine.bodies) {
            renderer.save();
            renderer.translate(body.position.x, body.position.y)
            renderer.rotate(body.angle)
            renderer.scale(0.1, 0.1)
            renderer.beginPath();
            renderer.moveTo(-1.0, 0);
            renderer.lineTo(1, 0);
            renderer.moveTo(0,-1.0);
            renderer.lineTo(0, 1);
            renderer.strokeStyle = 'black';
            renderer.lineWidth = 0.1;
            renderer.stroke();
            renderer.restore();

            for (const polygon of body.polygons) {
                const vertices = polygon.convexPolygon.globalPolygon.vertices;
                renderer.beginPath();
                MainGame.addPolygon(renderer, vertices);
                renderer.strokeStyle = 'black';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        }
    }

    renderContacts(context: SplitScreenGameContext, region: AABB, lag: number): void {
        const renderer = context.getRenderer();

        this.physicsEngine.contactConstraints.forEach((contactConstraint, contactKeyString) => {
            const contactManifold = contactConstraint.contactManifold;
            const normal = contactManifold.normal;
            const contactPoints = contactManifold.contactPoints;
            for (let i = 0; i < contactPoints.length; i++) {
                const contactPoint = contactPoints[i];
                const impulse = contactConstraint.contactPointImpulses[i];
                const contactKey = ContactKey.fromString(contactKeyString);
                
                //console.log(impulse.normalImpulse / context.getTickDeltaTime());
                if (impulse.normalImpulse / context.getTickDeltaTime() > 0.8) {
                    this.smackSound?.play();
                }

                

                if (impulse.normalImpulse / context.getTickDeltaTime() > 0.7) {
                  if (this.physicsEngine.bodies[contactKey.body0] == this.goat.head.body) {
                    this.goatScream?.play();
                  }

                  if (this.physicsEngine.bodies[contactKey.body1] == this.goat.head.body) {
                    this.goatScream?.play();
                  }
                    
                }



                const position = contactPoint.position;
                const normalImpulse = impulse.normalImpulse;

                renderer.beginPath();
                renderer.arc(position.x, position.y, 0.05, 0, 2 * Math.PI);
                renderer.fillStyle = 'red';
                renderer.fill();
                renderer.beginPath();

                renderer.moveTo(position.x, position.y);
                const end = Vector2D.addMultiplied(position, normal, normalImpulse);
                renderer.lineTo(end.x, end.y);
                renderer.strokeStyle = 'orange';
                renderer.lineWidth = 0.01;
                renderer.stroke();
            }
        });
    }

    renderSnow(context: SplitScreenGameContext, region: AABB, lag: number) {
        this.snow.forEach(snow => {
            snow.render(context, region, lag);
        })
    }

    renderLobby(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number): void {
        const renderer = context.getRenderer();
        const oldFillStyle = renderer.fillStyle;
        const x = region.start.x;
        const y = region.start.y;
        const w = region.end.x - region.start.x;
        const h = region.end.y - region.start.y;
        
        const fontSizes = [72, 36, 28, 14, 12, 10, 5, 2]
        const menuText = "Please hold until all players have joined";

        let textDimensions: TextMetrics;
        let i = 0;
        do {
            renderer.font = fontSizes[i++] + 'px Arial';
            textDimensions = renderer.measureText(menuText);
        } while (textDimensions.width >= w);
        
        renderer.fillStyle = "#cccccc";
        renderer.fillRect(x, y, w, h);

        renderer.fillStyle = "#dddddd";
        renderer.fillRect(x + 1, y + 1, w - 2, h - 2);
        
        renderer.fillStyle = "black";
        const oldTransform = renderer.getTransform();
        renderer.transform(1, 0, 0, -1,0, 0);
        renderer.fillText(menuText, x + (w-textDimensions.width)/2, y + h/2);
        renderer.setTransform(oldTransform)
        renderer.fillStyle = oldFillStyle;
    }

    renderWinner(context: any, region: { start: { x: number, y: number }, end: { x: number, y: number } }) {
        if (this.winner !== 5) {  // Check if there is a winner
            const renderer = context.getRenderer();
            const oldFillStyle = renderer.fillStyle;

            
            const x = region.start.x;
            const y = region.start.y;
            const w = region.end.x - region.start.x;
            const h = region.end.y - region.start.y;

            console.log(region)

            // Winner text
            const winnerText = `Winner is Player ${this.winner}`;

            // Try to fit the winner text in the available width
            const fontSizes = [72, 36, 28, 14, 12, 10, 5, 2];
            let textDimensions: TextMetrics;
            let i = 0;
            do {
                renderer.font = `${fontSizes[i++]}px Arial`;  // Incrementally smaller font sizes
                textDimensions = renderer.measureText(winnerText);
            } while (textDimensions.width >= w && i < fontSizes.length);

            //renderer.save();
            //renderer.translate(x, y)

            // Draw background
            renderer.fillStyle = "#cccccc";
            renderer.fillRect(x, y, w, h);

            renderer.fillStyle = "#dddddd";
            renderer.fillRect(x + 1, y + 1, w - 2, h - 2);

            // Draw winner text
            renderer.fillStyle = "black";
            const oldTransform = renderer.getTransform();
            renderer.transform(1, 0, 0, -1, 0, 0);

            

            
            document.title = winnerText;

            renderer.fillText(winnerText, (w - textDimensions.width) / 2, h / 2 + textDimensions.actualBoundingBoxAscent / 2);
            renderer.setTransform(oldTransform);

            // Restore the original fill style
            renderer.fillStyle = oldFillStyle;

            //renderer.restore();

            
        }

    }

    render(context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number): void {
        if(!this.inGame) {
            context.playerContexts.forEach((playerContext, playerIndex, map) => {
                this.renderLobby(context, region, lag, playerIndex);
            });
        }
        else {
            this.renderBackground(context, region, lag);
            this.renderHouse(context, region, lag);
            this.renderCameras(context, region, lag);
            //this.renderBodies(context, region, lag);
            this.renderContacts(context, region, lag);
            this.renderSnow(context, region, lag);
            this.goat.render(context, region, lag, playerIndex);
            this.renderWinner(context, region)

            context.playerContexts.forEach((playerContext, playerIndex, map) => {
                const hat = this.getHatForPlayer(playerIndex);

                if (typeof (hat) === "undefined" || hat === null) {
                    return undefined;
                }

                hat.render(context.getRenderer());
            });

            this.requireMap().render(context, region, lag, playerIndex);

            this.particleSystem.render(context, region, lag, playerIndex, this);

        }

    }
};
