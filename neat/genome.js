var genome_key = 0;

const SetupConnections = {
    NONE: 'NONE',
    ALL: 'ALL',
    SOME: 'SOME'
};

class Genome {
    constructor(key, config) {
        this.key = key;
        this.neurons = {};
        this.connections = {};
        this.input_neurons = [];
        this.output_neurons = [];
        this.fitness = null;
        this.config = config;
        this.neuronKey = 0;

        for (let i = 0; i < config.numberOfInputs; i++) {
            this.input_neurons.push(-i - 1);
        }

        for (let i = 0; i < config.numberOfOutputs; i++) {
            let neuron = Neuron.create(++this.neuronKey, config.neuron);
            this.neurons[neuron.key] = neuron;
            this.output_neurons.push(neuron.key);
        }

        if (config.setupConnections === SetupConnections.ALL || config.setupConnections === SetupConnections.SOME) {
            this.output_neurons.forEach(outputKey => {
                this.input_neurons.forEach(inputKey => {
                    let connection = Connection.create(inputKey, outputKey, config.connection);
                    this.connections[connection.key()] = connection;
                });
            });
        }

        if (config.setupConnections === SetupConnections.SOME) {
            let num = Math.random() * Object.keys(this.connections).length >> 0;
            for (let i = 0; i < num; i++) {
                this.deleteConnection();
            }
        }
    }

    crossOver(other) {
        if (this.fitness === null || other.fitness === null) {
            throw 'Missing fitness when trying crossover';
        }

        let result = new Genome(++genome_key, this.config);

        let parent1, parent2;
        if (this.fitness > other.fitness) {
            parent1 = this;
            parent2 = other;
        } else {
            parent1 = other;
            parent2 = this;
        }

        result.connections = {};
        for (let key of Object.keys(parent1.connections)) {
            let connection1 = parent1.connections[key];
            let connection2 = parent2.connections[key];
            if (!connection2) {
                result.connections[key] = new Connection(connection1.input, connection1.output, connection1.weight, connection1.enabled, connection1.config);
            } else  {
                result.connections[key] = connection1.crossOver(connection2);
            }
        }

        result.neurons = {};
        for (let key of Object.keys(parent1.neurons)) {
            let neuron1 = parent1.neurons[key];
            let neuron2 = parent2.neurons[key];
            if (!neuron2) {
                result.neurons[key] = new Neuron(neuron1.key, neuron1.bias, neuron1.aggregator, neuron1.activator, neuron1.config);
            } else {
                result.neurons[key] = neuron1.crossOver(neuron2);
            }
        }

        return result;
    }

    mutate() {
        if (Math.random() < this.config.connection.addChance) {
            this.addConnection();
        }

        if (Math.random() < this.config.connection.deleteChance) {
            this.deleteConnection();
        }

        if (Math.random() < this.config.neuron.addChance) {
            this.addNeuron();
        }

        if (Math.random() < this.config.neuron.deleteChance) {
            this.deleteNeuron();
        }

        Object.values(this.connections).forEach(connection => connection.mutate());
        Object.values(this.neurons).forEach(neuron => neuron.mutate());
    }

    addConnection() {
        let possibleOutputs = Object.keys(this.neurons);
        let possibleInputs = [...possibleOutputs, ...this.input_neurons];

        let input = Number(possibleInputs[Math.random() * possibleInputs.length >> 0]);
        let output = Number(possibleOutputs[Math.random() * possibleOutputs.length >> 0]);
        let key = Connection.keyify(input, output);

        if (Object.keys(this.connections).includes(key) || // Don't duplicate connections
            this.output_neurons.includes(input) && this.output_neurons.includes(output) || // Don't allow connections between output neurons
            this.createsCycle(input, output)) { // Don't allow loops
            return;
        }

        let connection = Connection.create(input, output, this.config.connection);
        this.connections[connection.key()] = connection;
    }

    deleteConnection() {
        if (Object.keys(this.connections).length) {
            let key = Object.keys(this.connections)[Math.random() * Object.keys(this.connections).length >> 0];
            delete this.connections[key];
        }
    }

    addNeuron() {
        if (!Object.keys(this.connections).length) {
            return;
        }

        let connection = Object.values(this.connections)[Math.random() * Object.values(this.connections).length >> 0];

        connection.enabled = false;
        let neuron = Neuron.create(++this.neuronKey, this.config.neuron);
        this.neurons[neuron.key] = neuron;
        this._addConnection(connection.input, neuron.key, 1.0);
        this._addConnection(neuron.key, connection.output, connection.weight);
    }

    _addConnection(input, output, weight) {
        let connection = Connection.create(input, output, this.config.connection);
        connection.weight = weight;
        connection.enabled = true;
        this.connections[connection.key()] = connection;
    }

    deleteNeuron() {
        let availableNeurons = [];
        for (let key of Object.keys(this.neurons)) {
            if (!this.output_neurons.includes(Number(key))) {
                availableNeurons.push(Number(key));
            }
        }

        if (!availableNeurons.length) {
            return;
        }

        let key = availableNeurons[Math.random() * availableNeurons.length >> 0];

        let toDelete = [];
        for (let connectionsKey of Object.keys(this.connections)) {
            let connection = this.connections[connectionsKey];
            if (connection.input === key || connection.output === key) {
                toDelete.push(connectionsKey);
            }
        }

        for (let toDeleteKey of toDelete) {
            delete this.connections[toDeleteKey];
        }

        delete this.neurons[key];
    }

    createsCycle(input, output) {
        if (input === output) {
            return true;
        }

        let visited = [output];
        while (true) {
            let numAdded = 0;
            for (let connection of Object.values(this.connections)) {
                let i = connection.input;
                let o = connection.output;
                if (visited.includes(i) && !visited.includes(o)) {
                    if (o == input) {
                        return true;
                    }

                    visited.push(o);
                    numAdded++;
                }
            }

            if (numAdded === 0) {
                return false;
            }
        }
    }

    distance(other) {
        let neuronDistance = 0.0;
        let disjointNeurons = 0;
        for (let key of Object.keys(other.neurons)) {
            if (!Object.keys(this.neurons).includes(key)) {
                disjointNeurons++;
            }
        }

        for (let key of Object.keys(this.neurons)) {
            if (!Object.keys(other.neurons).includes(key)) {
                disjointNeurons++;
            } else {
                neuronDistance += this.neurons[key].distance(other.neurons[key]);
            }
        }

        let maxNeurons = Math.max(Object.keys(this.neurons).length, Object.keys(other.neurons).length);
        neuronDistance += disjointNeurons * this.config.neuron.disjointCoefficient / maxNeurons;

        let connectionDistance = 0.0;
        let disjointConnections = 0;
        for (let key of Object.keys(other.connections)) {
            if (!Object.keys(this.connections).includes(key)) {
                disjointConnections++;
            }
        }

        for (let key of Object.keys(this.connections)) {
            if (!Object.keys(other.connections).includes(key)) {
                disjointConnections++;
            } else {
                connectionDistance += this.connections[key].distance(other.connections[key]);
            }
        }

        let maxConnections = Math.max(Object.keys(this.connections).length, Object.keys(other.connections).length);
        connectionDistance += disjointConnections * this.config.connection.disjointCoefficient / maxConnections;

        return neuronDistance + connectionDistance;
    }

    size() {
        let enabledConnections = Object.values(this.connections).filter(connection => connection.enabled);
        return Object.keys(this.neurons).length + enabledConnections.length;
    }

}