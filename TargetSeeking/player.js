class TargetSeekerPlayer extends Player {
	constructor(genome, species){
		super(genome, species);
		this.ship = new Ship();
		this.score = 1;
	}

	think() {}

	update() {
		if (this.dead) {
			return;
		}

		let turn = this.think();

		if (turn < 0) {
			this.ship.angle -= this.ship.turnSpeed;
		}

		if (turn > 0) {
			this.ship.angle += this.ship.turnSpeed;
		}

		if (!this.ship.update()) {
			this.dead = true;
			return;
		}

		let d = dist(this.ship.position.x, this.ship.position.y, game.target.position.x, game.target.position.y);
		if (d < 100) {
			this.score += 100 - d;
		} else {
			this.score++;
		}
	}

	draw(colors) {
		this.ship.draw(colors(this.species));
	}
}

class TargetSeekerHumanPlayer extends TargetSeekerPlayer {
	constructor(){
		super(null, 1);
	}

	think() {
		if (keyIsDown(LEFT_ARROW)) {
			return -1;
		}

		if (keyIsDown(RIGHT_ARROW)) {
			return 1;
		}

		return 0;
	}

	draw(colors) {
		super.draw(colors);
		textSize(32);
		fill('white');
		text('Score: ' + Math.round(this.score), 20, 40);
	}
}

class TargetSeekerAiPlayer extends TargetSeekerPlayer {
	constructor(genome, species){
		super(genome, species);
		this.lifespan = 0;
	}

	think() {
		let distanceToTarget = dist(this.ship.position.x, this.ship.position.y, game.target.position.x, game.target.position.y);
		let vectorToTarget = createVector(game.target.position.x, game.target.position.y, 0).sub(createVector(this.ship.position.x, this.ship.position.y, 0));
		let angleToTarget = createVector(this.ship.position.x, this.ship.position.y, 0).rotate(this.ship.angle * Math.PI / 180).angleBetween(vectorToTarget);
		let outputs = this.brain.activate([distanceToTarget, this.ship.angle, angleToTarget]);

		if (outputs[1] < 0.4) {
			return -1;
		}

		if (outputs[1] > 0.6) {
			return 1;
		}

		return 0;
	}

	update() {
		super.update();

		if (this.lifespan > 200) {
			this.dead = true;
			return;
		}

		this.lifespan++;
	}

	setFitness() {
		this.brain.fitness = this.score;
	}
}