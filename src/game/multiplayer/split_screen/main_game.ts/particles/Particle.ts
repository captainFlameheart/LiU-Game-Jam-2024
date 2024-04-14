class Particle {
    position: Vector2D;
    spawnTime: number;
    endTime: number;
    
    constructor(position: Vector2D, spawnTime: number, endTime: number) {
        this.position = position;
        this.spawnTime = spawnTime;
        this.endTime = endTime;
    }

    computeProgress(particleSystem: ParticleSystem) {
        return (particleSystem.time - this.spawnTime) / (this.endTime - this.spawnTime);
    }
    
    render(
        context: SplitScreenGameContext, region: AABB, lag: number, playerIndex: number, 
        particleSystem: ParticleSystem
    ) {
        const progress = this.computeProgress(particleSystem);
        const renderer = context.getRenderer();
        renderer.beginPath();
        const radius = Math.max(0, 0.2 * (1 - progress));
        renderer.arc(this.position.x, this.position.y, radius, 0, 2 * Math.PI);
        renderer.fillStyle = `rgba(255, 255, 255, ${1 - progress})`;
        renderer.fill();
    }
}