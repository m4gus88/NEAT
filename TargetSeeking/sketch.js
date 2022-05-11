var target, population, players, visualization;
var colors;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('canvascontainer');

    target = new Target();

    population = new Population();
    population.config.populationSize = 1000;
    population.config.numberOfInputs = 3;
    population.config.numberOfOutputs = 1;

    population.setup();

    players = [];
    population.species.species.forEach(s => s.members.forEach(genome => players.push(new Player(genome, s.key))));
    colors = d3.scaleOrdinal().domain([]).range(d3.schemeSet2);

    drawTable();
}

function draw() {
    target.update();

    if (!players.every(player => player.dead)) {
        players.forEach(player => player.update());
    } else {
        players.forEach(player => player.setFitness());
        population.evolve();

        players = [];
        population.species.species.forEach(s => s.members.forEach(genome => players.push(new Player(genome, s.key))));

        document.getElementById("currentGeneration").innerText = "Current Generation: " + population.generation;
        drawTable();

        if (!!population.bestGenome) {
            document.getElementById("bestFitness").innerText = "Best Fitness: " + Math.round(population.bestGenome.fitness);
            visualization = new Visualizer("best", population.bestGenome);
            visualization.draw();
        }
    }

    background(60);
    target.draw();
    players.forEach(player => player.draw());
}

function drawTable() {
    document.getElementById("species").innerHTML = '';

    let table = d3.select('body')
        .append('table')
        .attr('id', 'species-table');

    let header = table.append('tr');
    header.append('th')
        .text('Species');
    header.append('th')
        .text('Size');
    header.append('th')
        .text('Fitness');
    header.append('th')
        .text('Age');
    header.append('th')
        .text('Last improved');

    let species = population.species.species.sort((a, b) => b.fitness - a.fitness);
    for (let s of species) {
        let row = table.append('tr');
        row.append('td')
            .append('div')
            .attr('class', 'species-box')
            .style('background-color', d3.color(colors(s.key)).formatHex())
        row.append('td')
            .text(s.members.length);
        row.append('td')
            .text(Math.round(s.fitness));
        row.append('td')
            .text(s.generation - s.created);
        row.append('td')
            .text(s.lastImproved);
    }

    document.getElementById("species").append(document.getElementById("species-table"));
}