class Attributes {
    static randomizeNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    static mutateNumber(value, power, min, max) {
        return Math.max(min, Math.min(value + randomGaussian(0.0, power), max));
    }

    static randomizeString(options) {
        return options[Math.random() * options.length >> 0];
    }

    static cross(n1, n2) {
        if (Math.random() < 0.5) {
            return n1;
        }
        return n2;
    }
}
