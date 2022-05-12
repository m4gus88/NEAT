class Population {
    constructor(config = DEFAULT_CONFIG) {
        this.config = config;
        this.genomes = {};
        this.reproduction = new Reproduction();
        this.generation = 0;
        this.bestGenome = null;
        this.species = null;
        this.history = [];
    }

    static fromObject(o, config) {
        let p = new Population(config);

        p.genomes = {};
        o.genomes.forEach(g => p.genomes[g.key] = Genome.fromObject(g, config));
        p.generation = o.generation
        p.bestGenome = Genome.fromObject(o.bestGenome, config);
        p.species = SpeciesSet.fromObject(o.species, config);
        p.genomeHistory = o.history;

        return p;
    }

    toObject() {
        return {
            genomes: Object.values(this.genomes).map(g => g.toObject()),
            generation: this.generation,
            bestGenome: this.bestGenome ? this.bestGenome.toObject() : null,
            species: this.species.toObject(),
            genomeHistory: this.history,
        };
    }

    toObjectWithoutHistory() {
        return {
            genomes: Object.values(this.genomes).map(g => g.toObject()),
            generation: this.generation,
            bestGenome: this.bestGenome ? this.bestGenome.toObject() : null,
            species: this.species.toObject()
        };
    }

    setup() {
        for (let i = 0; i < this.config.populationSize; i++) {
            let genome = Genome.create(++genome_key, this.config);
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

        this.history.push(this.toObjectWithoutHistory());
        this.reproduce();
    }

    reproduce() {
        this.genomes = this.reproduction.reproduce(this.config.populationSize, this.species, this.config.reproduction);
        this.generation++;

        this.species.speciate(Object.values(this.genomes), this.generation);
    }

    revertToGeneration(generation) {
        let p = this.history[generation];
        this.genomes = {};
        p.genomes.forEach(g => this.genomes[g.key] = Genome.fromObject(g, this.config));

        this.generation = p.generation;
        this.bestGenome = p.bestGenome ? Genome.fromObject(p.bestGenome, this.config) : null;
        this.species = SpeciesSet.fromObject(p.species, this.config);
    }

}