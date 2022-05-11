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

		let distanceToTarget = dist(this.ship.position.x, this.ship.position.y, target.position.x, target.position.y);
		let vectorToTarget = createVector(target.position.x, target.position.y, 0).sub(createVector(this.ship.position.x, this.ship.position.y, 0));
		let angleToTarget = createVector(this.ship.position.x, this.ship.position.y, 0).rotate(this.ship.angle * Math.PI / 180).angleBetween(vectorToTarget);
		let outputs = this.brain.activate([distanceToTarget, this.ship.angle, angleToTarget]);

		if (outputs[1] < 0.4) {
			this.ship.angle -= this.ship.turnSpeed;
		}

		if (outputs[1] > 0.6) {
			this.ship.angle += this.ship.turnSpeed;
		}

		if (!this.ship.update()) {
			this.dead = true;
			return;
		}

		let d = dist(this.ship.position.x, this.ship.position.y, target.position.x, target.position.y);
		if (d < 100) {
			this.score += 100 - d;
		} else {
			this.score++;
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