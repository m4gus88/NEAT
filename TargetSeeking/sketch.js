var target, population, players, visualization;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('canvascontainer');

    target = new Target();

    population = new Population();
    population.config.populationSize = 1000;
    population.config.numberOfInputs = 5;
    population.config.numberOfOutputs = 2;

    population.setup();

    players = [];
    Object.values(population.genomes).forEach(genome => players.push(new Player(genome)));
}

function draw() {
    // target.update();

    if (!players.every(player => player.dead)) {
        players.forEach(player => player.update());
    } else {
        players.forEach(player => player.setFitness());
        population.evolve();

        players = [];
        Object.values(population.genomes).forEach(genome => players.push(new Player(genome)));


        document.getElementById("currentGeneration").innerText = "Current Generation: " + population.generation;
        if (!!population.bestGenome) {
            document.getElementById("bestFitness").innerText = "Best Fitness: " + population.bestGenome.fitness;
            visualization = new Visualizer("best", population.bestGenome);
            visualization.draw();
        }
    }

    background(60);
    target.draw();
    players.forEach(player => player.draw());
}