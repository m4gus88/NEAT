class RecurrentNetwork extends NetworkActivator {
    constructor(inputNodes, outputNodes, neuronEvals) {
        super(inputNodes, outputNodes, neuronEvals);
        this.values = [{}, {}];
        this.active = false;

        inputNodes.forEach(key => {
            this.values[0][key] = 0.0;
            this.values[1][key] = 0.0;
        });

        outputNodes.forEach(key => {
            this.values[0][key] = 0.0;
            this.values[1][key] = 0.0;
        });
    }

    static create(genome) {
        let connections = Object.values(genome.connections)
            .filter(connection => connection.enabled);

        let neuronInputs = {};
        connections.forEach(connection => {
            if (!neuronInputs[connection.output]) {
                neuronInputs[connection.output] = {};
            }
            neuronInputs[connection.output][connection.input] = connection.weight;
        });

        let neuronEvals = [];
        Object.keys(neuronInputs).forEach(key => {
            let neuron = genome.neurons[key];
            neuronEvals.push({
                neuronId: key,
                aggregator: AGGREGATORS[neuron.aggregator],
                activator: ACTIVATORS[neuron.activator],
                bias: neuron.bias,
                inputWeights: neuronInputs[neuron.key]
            });
        });

        return new RecurrentNetwork(genome.input_neurons, genome.output_neurons, neuronEvals);
    }

    activate(inputs) {
        let inputValues = this.values[this.active ? 0 : 1];
        let outputValues = this.values[this.active ? 1 : 0];
        this.active = !this.active;

        let i = -1;
        for (let input of inputs) {
            inputValues[i] = input;
            outputValues[i] = input;
            i--;
        }

        for (let neuronEval of this.neuronEvals) {
            let nodeInputs = [];
            for (let input of Object.keys(neuronEval.inputWeights)) {
                nodeInputs.push(inputValues[input] * neuronEval.inputWeights[input]);
            }

            let output = neuronEval.aggregator(nodeInputs);
            outputValues[neuronEval.neuronId] = neuronEval.activator(neuronEval.bias + output);
        }

        let outputs = {}
        for (let key of Object.keys(outputValues)) {
            if (this.outputNodes.includes(Number(key))) {
                outputs[key] = outputValues[key];
            }
        }
        return outputs;
    }

}