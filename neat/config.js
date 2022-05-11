var DEFAULT_CONFIG = {
    numberOfInputs: 0,
    numberOfOutputs: 0,
    setupConnections: SetupConnections.SOME,       // Can be ALL, SOME, or NONE. Determines how many connections should there be between inputs and outputs in the first generation.
    feedForward: true,                             // If false, looping connections are possible.
    populationSize: 500,
    neuron: {
        bias: {
            defaultMean: 0.0,
            defaultDeviation: 1.0,
            min: -30.0,
            max: 30.0,
            mutationChance: 0.7,                   // Probability of mutating neuron bias.
            mutationPower: 0.5,
            replaceChance: 0.1,                    // Probability of completely replacing neuron bias.
            distanceCoefficient: 0.6               // How many points of difference one point of bias difference makes.
        },
        response: {
            defaultMean: 1.0,
            defaultDeviation: 0.1,
            min: -30.0,
            max: 30.0,
            mutationChance: 0.1,                   // Probability of mutating neuron response.
            mutationPower: 0.1,
            replaceChance: 0.1,                    // Probability of completely replacing neuron response.
            distanceCoefficient: 0.6               // How many points of difference one point of response difference makes.
        },
        aggregator: {
            defaultValue: 'sum',
            mutateRate: 0.01,
            options: Object.values(AGGREGATORS),   // Needs to be one of the functions in AGGREGATORS.
            distanceCoefficient: 1.0               // How many points of difference it makes to have a different aggregator function.
        },
        activator: {
            defaultValue: 'sigmoid',
            mutateRate: 0.05,
            options: Object.values(ACTIVATORS),    // Needs to be one of the functions in ACTIVATORS.
            distanceCoefficient: 1.0               // How many points of difference it makes to have a different activator function.
        },
        addChance: 0.2,                            // Probability of adding a neuron when mutating.
        deleteChance: 0.2,                         // Probability of deleting a neuron when mutating.
        disjointCoefficient: 1.0                   // How many points of difference it makes to have a neuron the other genome doesn't.
    },
    connection: {
        weight: {
            defaultMean: 0.0,
            defaultDeviation: 1.0,
            min: -30.0,
            max: 30.0,
            mutationChance: 0.8,                  // Probability of mutating connection weight.
            mutationPower: 0.5,
            replaceChance: 0.1,                   // Probability of completely replacing connection weight.
            distanceCoefficient: 0.6              // How many points of difference one point of weight difference makes.
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
        distanceThreshold: 3.0,                   // How many points of difference does it take to not fit into the same species.
        extinctionThreshold: 20                   // How many generations does it take for a species to go extinct if they're not improving.
    },
    reproduction: {
        survivalThreshold: 0.2,                   // Proportion of the population that survives from each species.
        speciesElitism: 0,                        // How many species can survive even if they're not improving.
        elitism: 0                                // How many members transfer over (without crossing or mutation) from each species.
    }
};