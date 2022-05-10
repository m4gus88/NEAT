const AGGREGATORS = {
    product: function (x) {
        return x.reduce((a, b) => a * b, 1.0);
    },
    sum: function (x) {
        return x.reduce((a, b) => a + b, 0.0);
    },
    min: function (x) {
        return x.reduce((a, b) => a < b ? a : b, Number.POSITIVE_INFINITY);
    },
    max: function (x) {
        return x.reduce((a, b) => a > b ? a : b, Number.NEGATIVE_INFINITY);
    },
    maxabs: function (x) {
        return x.reduce((a, b) => Math.abs(a) > Math.abs(b) ? a : b, 0.0);
    },
    median: function (x) {
        x.sort((a, b) => a - b);
        let half = Math.floor(x.length / 2);

        if (x.length % 2) {
            return x[half];
        }

        return (x[half - 1] + x[half]) / 2.0;
    },
    mean: function (x) {
        let l = x.length;
        return AGGREGATORS["sum"](x) / l;
    }
};