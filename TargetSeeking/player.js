class Player{
	constructor(genome, species){
		this.brain = genome;
		this.species = species;
		this.ship = new Ship();
		this.score = 1;
		this.lifespan = 0;
		this.dead = false;
	}

	update() {
		if (this.dead) {
			return;
		}

		let outputs = this.brain.activate([this.ship.position.x, this.ship.position.y, this.ship.angle, target.position.x, target.position.y]);

		if (outputs[1] < 0.3) {
			this.ship.angle -= this.ship.turnSpeed;
		}

		if (outputs[1] > 0.7) {
			this.ship.angle += this.ship.turnSpeed;
		}

		if (!this.ship.update()) {
			this.dead = true;
			return;
		}

		let d = dist(this.ship.position.x, this.ship.position.y, target.position.x, target.position.y);
		if (d < 100) {
			this.score += 100 - d;
		}

		if (this.lifespan > 200) {
			this.dead = true;
			return;
		}

		this.lifespan++;
	}

	draw() {
		this.ship.draw(colors(this.species));
	}

	setFitness() {
		this.brain.fitness = this.score;
	}
}