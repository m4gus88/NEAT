var DEFAULT_CONFIG = {
    numberOfInputs: 0,
    numberOfOutputs: 0,
    setupConnections: SetupConnections.ALL,        // Can be ALL, SOME, or NONE. Determines how many connections should there be between inputs and outputs in the first generation.
    feedForward: false,                            // If false, looping connections are possible.
    populationSize: 500,
    neuron: {
        bias: {
            min: -3.0,
            max: 3.0,
            mutationChance: 0.7,                   // Probability of mutating neuron bias.
            mutationPower: 0.4,
            replaceChance: 0.02,                   // Probability of completely replacing neuron bias.
            distanceCoefficient: 0.3               // How many points of difference one point of bias difference makes.
        },
        aggregator: {
            defaultValue: 'sum',
            mutateRate: 0.2,
            options: Object.keys(AGGREGATORS),     // Needs to be one of the functions in AGGREGATORS.
            distanceCoefficient: 0.2               // How many points of difference it makes to have a different aggregator function.
        },
        activator: {
            defaultValue: 'sigmoid',
            mutateRate: 0.2,
            options: Object.keys(ACTIVATORS),      // Needs to be one of the functions in ACTIVATORS.
            distanceCoefficient: 0.2               // How many points of difference it makes to have a different activator function.
        },
        addChance: 0.2,                            // Probability of adding a neuron when mutating.
        deleteChance: 0.2,                         // Probability of deleting a neuron when mutating.
        disjointCoefficient: 1.0                   // How many points of difference it makes to have a neuron the other genome doesn't.
    },
    connection: {
        weight: {
            min: -3.0,
            max: 3.0,
            mutationChance: 0.7,                  // Probability of mutating connection weight.
            mutationPower: 0.4,
            replaceChance: 0.02,                  // Probability of completely replacing connection weight.
            distanceCoefficient: 0.3              // How many points of difference one point of weight difference makes.
        },
        enabled: {
            mutationChance: 0.01,
            distanceCoefficient: 1.0
        },
        addChance: 0.2,                           // Probability of adding a connection when mutating.
        deleteChance: 0.2,                        // Probability of deleting a connection when mutating.
        disjointCoefficient: 1.0                  // How many points of difference it makes to have a connection the other genome doesn't.
    },
    species: {
        distanceThreshold: 5.0,                   // How many points of difference does it take to not fit into the same species.
        extinctionThreshold: 10                   // How many generations does it take for a species to go extinct if they're not improving.
    },
    reproduction: {
        survivalThreshold: 0.2,                   // Proportion of the population that survives from each species.
        speciesElitism: 5,                        // How many species can survive even if they're not improving.
        elitism: 2                                // How many members transfer over (without crossing or mutation) from each species.
    }
};