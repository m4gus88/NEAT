class NetworkActivator {
    constructor(inputNodes, outputNodes, neuronEvals) {
        this.inputNodes = inputNodes;
        this.outputNodes = outputNodes;
        this.neuronEvals = neuronEvals;
    }

    static create(genome) {}

    activate(inputs) {}

    neuronResponse(neuronEval, inputs) {
        return neuronEval.activator(neuronEval.aggregator(inputs) * neuronEval.response + neuronEval.bias);
    }

}