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
            replaceChance: 0.02
        },
        aggregator: {
            defaultValue: 'sum',
            mutateRate: 0.0,
            options: ['sum']
        },
        activator: {
            defaultValue: 'sigmoid',
            mutateRate: 0.0,
            options: ['sigmoid']
        },
        addChance: 0.2,
        deleteChance: 0.2
    },
    connection: {
        weight: {
            min: -30.0,
            max: 30.0,
            mutationChance: 0.1,
            mutationPower: 0.4,
            replaceChance: 0.02
        },
        enabledMutationChance: 0.01,
        addChance: 0.5,
        deleteChance: 0.5
    }
};

class Population {
    constructor() {
        this.config = DEFAULT_CONFIG;
        this.genomes = {};
        this.reproduction = new Reproduction();
        this.generation = 0;
        this.bestGenome = null;
    }

    setup() {
        for (let i = 0; i < this.config.populationSize; i++) {
            let genome = this.reproduction.createGenome(this.config);
            this.genomes[genome.key] = genome;
        }
    }

    evolve() {
        let best = null
        for (let genome of Object.values(this.genomes)) {
            if (!best || genome.fitness > best.fitness) {
                best = genome;
            }
        }
        this.bestGenome = best;

        let newGenomes = this.reproduction.reproduce(this.config.populationSize, this.genomes);
        delete this.genomes;
        this.genomes = newGenomes;
        this.generation++;
    }

}