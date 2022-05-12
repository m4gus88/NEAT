var target, config, population, players, visualization, paused, replayMode;
var colors;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('canvascontainer');
    colors = d3.scaleOrdinal().domain([]).range(d3.schemeSet2);

    paused = false;
    replayMode = false;
    target = new Target();

    population = new Population();
    population.config.populationSize = 1000;
    population.config.numberOfInputs = 3;
    population.config.numberOfOutputs = 1;
    config = population.config;

    population.setup();
    reset();

    // Setup load button
    (function(){

        function onChange(event) {
            var reader = new FileReader();
            reader.onload = onReaderLoad;
            reader.readAsText(event.target.files[0]);
        }

        function onReaderLoad(event){
            console.log(event.target.result);
            var obj = JSON.parse(event.target.result);
            population = Population.fromObject(obj, config);
            reset();
        }

        document.getElementById('loadPopulation').addEventListener('change', onChange);

    }());
}

function draw() {
    if (paused) {
        return;
    }

    if (!players.every(player => player.dead)) {
        target.update();
        players.forEach(player => player.update());
    } else {
        if (!replayMode) {
            players.forEach(player => player.setFitness());
            population.evolve();
            reset();
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

function pause() {
    paused = !paused;

    if (paused) {
        document.getElementById('pause').setAttribute('value', 'Unpause');
    } else {
        document.getElementById('pause').setAttribute('value', 'Pause');
    }
}

function reset() {
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

function savePopulation() {
    let blob = new Blob([JSON.stringify(population.toObject())], { type: "text/plain;charset=utf-8" });
    let url = window.URL || window.webkitURL;
    let link = url.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
}

function replay() {
    replayMode = !replayMode;

    if (replayMode) {
        d3.select('#replay').attr('value', 'Back to live');
        d3.select('#back').style('display', 'block');
        d3.select('#forward').style('display', 'block');
        population.revertToGeneration(population.history.length - 1);
    } else {
        d3.select('#replay').attr('value', 'Replay');
        d3.select('#back').style('display', 'none');
        d3.select('#forward').style('display', 'none');

        population.revertToGeneration(population.history.length - 1);
        population.reproduce();
    }

    reset();
}

function back() {
    if (population.generation > 0) {
        population.revertToGeneration(population.generation - 1);
        reset();
    }
}

function forward() {
    if (population.generation < population.history.length - 1) {
        population.revertToGeneration(population.generation + 1);
        reset();
    }
}