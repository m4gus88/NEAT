var DEFAULT_CONFIG = {
    numberOfInputs: 0,
    numberOfOutputs: 0,
    setupConnections: SetupConnections.ALL,
    feedForward: true,
    populationSize: 500,
    neuron: {
        bias: {
            min: -30.0,
            max: 30.0,
            mutationChance: 0.7,
            mutationPower: 0.4,
            replaceChance: 0.02,
            distanceCoefficient: 0.3
        },
        aggregator: {
            defaultValue: 'sum',
            mutateRate: 0.0,
            options: ['sum'],
            distanceCoefficient: 1.0
        },
        activator: {
            defaultValue: 'sigmoid',
            mutateRate: 0.0,
            options: ['sigmoid'],
            distanceCoefficient: 1.0
        },
        addChance: 0.2,
        deleteChance: 0.2,
        disjointCoefficient: 1.0
    },
    connection: {
        weight: {
            min: -30.0,
            max: 30.0,
            mutationChance: 0.1,
            mutationPower: 0.4,
            replaceChance: 0.02,
            distanceCoefficient: 0.3
        },
        enabled: {
            mutationChance: 0.01,
            distanceCoefficient: 1.0
        },
        addChance: 0.2,
        deleteChance: 0.2,
        disjointCoefficient: 1.0
    },
    species: {
        distanceThreshold: 70.0,
        extinctionThreshold: 10,
    },
    reproduction: {
        survivalThreshold: 0.2,
        elitism: 2
    }
};

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