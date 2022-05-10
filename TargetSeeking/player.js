class Player{
	constructor(genome){
		this.brain = genome;
		this.ship = new Ship();
		this.score = 1;
		this.lifespan = 0;
		this.dead = false;
	}

	update() {
		if (this.dead) {
			return;
		}

		let outputs = FeedForwardNetwork.create(this.brain).activate([this.ship.position.x, this.ship.position.y, this.ship.angle, target.position.x, target.position.y]);

		if (outputs[1] > 0.5) {
			this.ship.angle -= this.ship.turnSpeed;
		}

		if (outputs[2] > 0.5) {
			this.ship.angle += this.ship.turnSpeed;
		}

		this.ship.update();

		let d = dist(this.ship.position.x, this.ship.position.y, target.position.x, target.position.y);
		if (d < 100) {
			this.score += 100 - d;
		}

		if (this.lifespan > 200) {
			this.dead = true;
		}

		this.lifespan++;
	}

	draw() {
		this.ship.draw();
	}

	setFitness() {
		this.brain.fitness = this.score;
	}
}