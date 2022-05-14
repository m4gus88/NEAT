class Game {
    constructor(config, width, height) {
        this.config = config;
        this.players = [];
        this.population = new Population();
        this.visualization = null;
        this.paused = false;
        this.replayMode = false;
        this.humanPlayer = false;
        this.colors = d3.scaleOrdinal().domain([]).range(d3.schemeSet2);
        this.width = width;
        this.height = height;
    }

    setup() {
        let canvas = createCanvas(this.width, this.height);
        canvas.parent('canvascontainer');

        this.population.setup();
        this.reset();

        // Setup load button
        (function(){

            function onChange(event) {
                var reader = new FileReader();
                reader.onload = onReaderLoad;
                reader.readAsText(event.target.files[0]);
            }

            function onReaderLoad(event){
                var obj = JSON.parse(event.target.result);
                game.population = Population.fromObject(obj, this.config);
                this.reset();
            }

            document.getElementById('loadPopulation').addEventListener('change', onChange);
        }());
    }

    reset() {
        this.gameReset();

        this.players = [];

        if (this.humanPlayer) {
            this.players.push(this.createHumanPlayer());
        } else {
            this.population.species.species.forEach(s => s.members.forEach(genome => this.players.push(this.createAiPlayer(genome, s.key))));

            document.getElementById("currentGeneration").innerText = "Current Generation: " + this.population.generation;
            this.drawSpeciesTable();

            if (!!this.population.bestGenome) {
                document.getElementById("bestFitness").innerText = "Best Fitness: " + Math.round(this.population.bestGenome.fitness);
                this.visualization = new Visualizer("best", this.population.bestGenome);
                this.visualization.draw();
            }
        }
    }

    gameReset() {}

    createAiPlayer(genome, species) {}

    createHumanPlayer() {}

    update() {
        if (this.paused) {
            return;
        }

        if (!this.players.every(player => player.dead)) {
            this.gameUpdate();
        } else {
            if (!this.replayMode && !this.humanPlayer) {
                this.players.forEach(player => player.setFitness());
                this.population.evolve();
                this.reset();
            }
        }

        this.gameDraw();
    }

    gameUpdate() {}

    updatePlayers() {
        this.players.forEach(player => player.update());
    }

    gameDraw() {}

    drawPlayers() {
        this.players.forEach(player => player.draw(this.colors));
    }

    drawSpeciesTable() {
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

        let species = this.population.species.species.sort((a, b) => b.fitness - a.fitness);
        for (let s of species) {
            let row = table.append('tr');
            row.append('td')
                .append('div')
                .attr('class', 'species-box')
                .style('background-color', d3.color(this.colors(s.key)).formatHex())
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

    savePopulation() {
        let blob = new Blob([JSON.stringify(this.population.toObject())], { type: "text/plain;charset=utf-8" });
        let url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);

        let a = document.createElement('a');
        a.href = link;
        a.target = '_blank';
        a.download = 'population.json';
        document.body.append(a);
        a.click();
        document.body.removeChild(a);
    }

    pause() {
        this.paused = !this.paused;

        if (this.paused) {
            document.getElementById('pause').setAttribute('value', 'Unpause');
        } else {
            document.getElementById('pause').setAttribute('value', 'Pause');
        }
    }

    replay() {
        this.replayMode = !this.replayMode;

        if (this.replayMode) {
            d3.select('#replay').attr('value', 'Back to live');
            d3.select('#back').style('display', 'inline-block');
            d3.select('#forward').style('display', 'inline-block');
            this.population.revertToGeneration(this.population.history.length - 1);
        } else {
            d3.select('#replay').attr('value', 'Replay');
            d3.select('#back').style('display', 'none');
            d3.select('#forward').style('display', 'none');

            this.population.revertToGeneration(this.population.history.length - 1);
            this.population.reproduce();
        }

        this.reset();
    }

    back() {
        if (this.population.generation > 0) {
            this.population.revertToGeneration(this.population.generation - 1);
            this.reset();
        }
    }

    forward() {
        if (this.population.generation < this.population.history.length - 1) {
            this.population.revertToGeneration(this.population.generation + 1);
            this.reset();
        }
    }

    switchHumanPlayer() {
        this.humanPlayer = !this.humanPlayer;
        this.replayMode = false;

        d3.select('#back').style('display', 'none');
        d3.select('#forward').style('display', 'none');

        if (this.humanPlayer) {
            d3.select('#switchHumanPlayer').attr('value', 'Back to AI');
            d3.select('#save').style('display', 'none');
            d3.select('#loadPopulation').style('display', 'none');
            d3.select('#replay').style('display', 'none');
            d3.select('#reset').attr('value', 'Restart');
        } else {
            d3.select('#switchHumanPlayer').attr('value', 'Let me play');
            d3.select('#save').style('display', 'inline-block');
            d3.select('#loadPopulation').style('display', 'inline-block');
            d3.select('#replay').style('display', 'inline-block').attr('value', 'Replay');
            d3.select('#reset').attr('value', 'Restart generation');

            this.population.revertToGeneration(this.population.history.length - 1);
            this.population.reproduce();
        }

        this.reset();
    }
}