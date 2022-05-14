var game;

function setup() {
    let config = DEFAULT_CONFIG;
    config.populationSize = 1000;
    config.numberOfInputs = 3;
    config.numberOfOutputs = 1;
    game = new TargetSeekerGame(config, 600, 600);
    game.setup();
}

function draw() {
    game.update();
}