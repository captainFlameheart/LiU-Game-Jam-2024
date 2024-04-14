class ParticleSystem {
    particles: Particle[];
    time: number;

    constructor(particles: Particle[]) {
        this.particles = particles;
        this.time = 0;
    }

    spawnParticle(position: Vector2D) {
        this.particles.push(new Particle(position, this.time, this.time + 0.1 + Math.random() * 1));
    }

    tick(context: SplitScreenGameContext,  game: MainGame) {
        this.time += context.getTickDeltaTime();

        game.physicsEngine.contactConstraints.forEach((contactConstraint, contactKeyString) => {
            const contactKey = ContactKey.fromString(contactKeyString);
            const map = game.map;
            if (map === null) {
                throw new Error('Map is null');
            }
            const mountainBody = map.body;
            if (mountainBody === null) {
                throw new Error('Body is null');
            }
            const body0 = game.physicsEngine.bodies[contactKey.body0];
            const body1 = game.physicsEngine.bodies[contactKey.body1];
            if (body0 === mountainBody || body1 === mountainBody) {
                for (const contactPoint of contactConstraint.contactManifold.contactPoints) {
                    const position = contactPoint.position;
                    this.spawnParticle(position);
                }
            } 
        });

        for (var i = this.particles.length - 1; i >= 0; i--)
            {
                // check if the element is odd
                if (this.particles[i].computeProgress(this) > 1) {
                    // remove one element at the current index
                    this.particles.splice(i, 1);
                }
            }
    }

    render(
        context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number, 
        game: MainGame
    ) {
        for (const particle of this.particles) {
            particle.render(context, region, lag, playerIndex, this);
        }
    }
}