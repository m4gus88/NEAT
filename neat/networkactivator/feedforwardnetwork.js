class FeedForwardNetwork extends NetworkActivator {
    constructor(inputNodes, outputNodes, neuronEvals) {
        super(inputNodes, outputNodes, neuronEvals);
        this.values = {}
        inputNodes.forEach(key => this.values[key] = 0.0);
        outputNodes.forEach(key => this.values[key] = 0.0);
    }

    static create(genome) {
        let connections = Object.values(genome.connections)
            .filter(connection => connection.enabled);

        let layers = FeedForwardNetwork.calculateLayers(genome.input_neurons, connections);
        let neuronEvals = [];
        for (let neuronKeys of layers) {
            for (let neuronKey of neuronKeys) {
                let neuron = genome.neurons[neuronKey];
                let inputWeights = {};
                connections.filter(connection => connection.output === neuronKey)
                    .forEach(connection => inputWeights[connection.input] = connection.weight);

                neuronEvals.push({
                    neuronId: neuronKey,
                    aggregator: AGGREGATORS[neuron.aggregator],
                    activator: ACTIVATORS[neuron.activator],
                    bias: neuron.bias,
                    inputWeights: inputWeights
                });
            }
        }

        return new FeedForwardNetwork(genome.input_neurons, genome.output_neurons, neuronEvals);
    }

    static calculateLayers(inputNodes, connections) {
        let layers = [];
        let visited = new Set();
        inputNodes.forEach(node => visited.add(node));
        while (true) {
            let keys = connections.filter(connection => visited.has(connection.input) && !visited.has(connection.output))
                .map(connection => connection.output);

            let keysToAdd = keys.filter(key => connections.filter(connection => connection.output === key).every(connection => visited.has(connection.input)));
            if (!keysToAdd.length) {
                break;
            }

            let s = new Set();
            keysToAdd.forEach(key => {
                visited.add(key);
                s.add(key);
            });
            layers.push(s);
        }

        return layers;
    }

    activate(inputs) {
        let i = -1;
        for (let input of inputs) {
            this.values[i] = input;
            i--;
        }

        for (let neuronEval of this.neuronEvals) {
            let nodeInputs = [];
            for (let input of Object.keys(neuronEval.inputWeights)) {
                nodeInputs.push(this.values[input] * neuronEval.inputWeights[input]);
            }

            let output = neuronEval.aggregator(nodeInputs);
            this.values[neuronEval.neuronId] = neuronEval.activator(neuronEval.bias + output);
        }

        let outputs = {}
        for (let key of Object.keys(this.values)) {
            if (this.outputNodes.includes(Number(key))) {
                outputs[key] = this.values[key];
            }
        }
        return outputs;
    }

}