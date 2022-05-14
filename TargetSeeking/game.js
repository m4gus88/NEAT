class TargetSeekerGame extends Game {
    constructor(config, width, height) {
        super(config, width, height);
    }

    setup() {
        super.setup();
        this.target = new Target();
    }

    gameReset() {
        this.players = [];
        this.population.species.species.forEach(s => s.members.forEach(genome => this.players.push(new TargetSeekerPlayer(genome, s.key))));
    }

    createAiPlayer(genome, species) {
        return new TargetSeekerAiPlayer(genome, species);
    }

    createHumanPlayer() {
        return new TargetSeekerHumanPlayer();
    }

    gameUpdate() {
        this.target.update();
        this.updatePlayers();
    }

    gameDraw() {
        background(60);
        this.target.draw();
        this.drawPlayers();
    }
}