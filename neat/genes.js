class Neuron {
    constructor(key, bias, response, aggregator, activator, config) {
        this.key = key;
        this.bias = bias;
        this.response = response;
        this.aggregator = aggregator;
        this.activator = activator;
        this.config = config;
    }

    static create(key, config) {
        let neuron = new Neuron(key, 0.0, 0.0, config.aggregator.defaultValue, config.activator.defaultValue, config);
        neuron.init();
        return neuron;
    }

    static fromObject(o, config) {
        return new Neuron(o.key, o.bias, o.response, o.aggregator, o.activator, config);
    }

    toObject() {
        return {
            key: this.key,
            bias: this.bias,
            response: this.response,
            aggregator: this.aggregator,
            activator: this.activator
        };
    }

    init() {
        this.bias = Attributes.initNumber(this.config.bias.defaultMean, this.config.bias.defaultDeviation);
        this.bias = Attributes.initNumber(this.config.response.defaultMean, this.config.response.defaultDeviation);
        this.aggregator = this.config.aggregator.defaultValue;
        this.activator = this.config.activator.defaultValue;
    }

    crossOver(other) {
        return new Neuron(this.key, Attributes.cross(this.bias, other.bias),
            Attributes.cross(this.response, other.response),
            Attributes.cross(this.aggregator, other.aggregator),
            Attributes.cross(this.activator, other.activator),
            this.config);
    }

    mutate() {
        if (Math.random() < this.config.bias.mutationChance) {
            this.bias = Attributes.mutateNumber(this.bias, this.config.bias.mutationPower, this.config.bias.min, this.config.bias.max);
        }

        if (Math.random() < this.config.bias.replaceChance) {
            this.bias = Attributes.initNumber(this.config.bias.min, this.config.bias.max);
        }

        if (Math.random() < this.config.response.mutationChance) {
            this.response = Attributes.mutateNumber(this.response, this.config.response.mutationPower, this.config.response.min, this.config.response.max);
        }

        if (Math.random() < this.config.response.replaceChance) {
            this.response = Attributes.initNumber(this.config.response.min, this.config.response.max);
        }

        if (Math.random() < this.config.aggregator.mutationChance) {
            this.aggregator = Attributes.randomizeString(this.config.aggregator.options);
        }

        if (Math.random() < this.config.activator.mutationChance) {
            this.activator = Attributes.randomizeString(this.config.activator.options);
        }
    }

    distance(other) {
        let d = (Math.abs(this.bias - other.bias) * this.config.bias.distanceCoefficient +
            Math.abs(this.response - other.response)) * this.config.response.distanceCoefficient;

        if (this.aggregator !== other.aggregator) {
            d += this.config.aggregator.distanceCoefficient;
        }

        if (this.activator !== other.activator) {
            d += this.config.activator.distanceCoefficient;
        }
        return d;
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

    static fromObject(o, config) {
        return new Connection(o.input, o.output, o.weight, o.enabled, config);
    }

    static keyify(input, output) {
        return '' + input + ',' + output;
    }

    toObject() {
        return {
            input: this.input,
            output: this.output,
            weight: this.weight,
            enabled: this.enabled
        }
    }

    key() {
        return Connection.keyify(this.input, this.output);
    }

    init() {
        this.weight = Attributes.initNumber(this.config.weight.defaultMean, this.config.weight.defaultDeviation);
    }

    crossOver(other) {
        return new Connection(this.input, this.output, Attributes.cross(this.weight, other.weight), this.enabled, this.config);
    }

    mutate() {
        if (Math.random() < this.config.weight.mutationChance) {
            this.weight = Attributes.mutateNumber(this.weight, this.config.weight.mutationPower, this.config.weight.min, this.config.weight.max);
        }

        if (Math.random() < this.config.weight.replaceChance) {
            this.weight = Attributes.initNumber(this.config.weight.min, this.config.weight.max);
        }

        if (Math.random() < this.config.enabled.mutationChance) {
            this.enabled = Math.random() < 0.5;
        }
    }

    distance(other) {
        let d = Math.abs(this.weight - other.weight) * this.config.weight.distanceCoefficient;
        if (this.enabled !== other.enabled) {
            d += this.config.enabled.distanceCoefficient;
        }
        return d;
    }
}