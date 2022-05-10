class Neuron {
    constructor(key, bias, aggregator, activator, config) {
        this.key = key;
        this.bias = bias;
        this.aggregator = aggregator;
        this.activator = activator;
        this.config = config;
    }

    static create(key, config) {
        let neuron = new Neuron(key, 0.0, config.aggregator.defaultValue, config.activator.defaultValue, config);
        neuron.init();
        return neuron;
    }

    init() {
        this.bias = Attributes.randomizeNumber(this.config.bias.min, this.config.bias.max);
        this.aggregator = this.config.aggregator.defaultValue;
        this.activator = this.config.activator.defaultValue;
    }

    crossOver(other) {
        return new Neuron(this.key, Attributes.cross(this.bias, other.bias),
            Attributes.cross(this.aggregator, other.aggregator),
            Attributes.cross(this.activator, other.activator),
            this.config);
    }

    mutate() {
        if (Math.random() < this.config.bias.mutationChance) {
            this.bias = Attributes.mutateNumber(this.bias, this.config.bias.mutationPower, this.config.bias.min, this.config.bias.max);
        }

        if (Math.random() < this.config.bias.replaceChance) {
            this.bias = Attributes.randomizeNumber(this.config.bias.min, this.config.bias.max);
        }

        if (Math.random() < this.config.aggregator.mutationChance) {
            this.aggregator = Attributes.randomizeString(this.config.aggregator.options);
        }

        if (Math.random() < this.config.activator.mutationChance) {
            this.activator = Attributes.randomizeString(this.config.activator.options);
        }
    }
}

class Connection {
    constructor(input, output, weight, enabled, config) {
        this.input = input;
        this.output = output;
        this.weight = weight
        this.enabled = enabled
        this.config = config;
    }

    static create(input, output, config) {
        let connection = new Connection(input, output, 0.0, true, config);
        connection.init();
        return connection;
    }

    static keyify(input, output) {
        return '' + input + ',' + output;
    }

    key() {
        return Connection.keyify(this.input, this.output);
    }

    init() {
        this.weight = Attributes.randomizeNumber(this.config.weight.min, this.config.weight.max);
    }

    crossOver(other) {
        return new Connection(this.input, this.output, Attributes.cross(this.weight, other.weight), this.enabled, this.config);
    }

    mutate() {
        if (Math.random() < this.config.weight.mutationChance) {
            this.weight = Attributes.mutateNumber(this.weight, this.config.weight.mutationPower, this.config.weight.min, this.config.weight.max);
        }

        if (Math.random() < this.config.weight.replaceChance) {
            this.weight = Attributes.randomizeNumber(this.config.weight.min, this.config.weight.max);
        }

        if (Math.random() < this.config.enabledMutationChance) {
            this.enabled = Math.random() < 0.5;
        }
    }
}