class Population {
    constructor() {
        this.config = DEFAULT_CONFIG;
        this.genomes = {};
        this.reproduction = new Reproduction();
        this.generation = 0;
        this.bestGenome = null;
        this.species = null;
    }

    setup() {
        for (let i = 0; i < this.config.populationSize; i++) {
            let genome = this.reproduction.createGenome(this.config);
            this.genomes[genome.key] = genome;
        }

        this.species = new SpeciesSet(this.config.species);
        this.species.speciate(Object.values(this.genomes), 0);
    }

    evolve() {
        let best = null
        for (let genome of Object.values(this.genomes)) {
            if (!best || genome.fitness > best.fitness) {
                best = genome;
            }
        }
        this.bestGenome = best;

        this.species.updateFitness();

        let newGenomes = this.reproduction.reproduce(this.config.populationSize, this.species, this.config.reproduction);
        delete this.genomes;
        this.genomes = newGenomes;
        this.generation++;

        this.species.speciate(Object.values(this.genomes), this.generation);
    }

}