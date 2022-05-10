const ACTIVATORS = {
    sigmoid: function (x) {
        x = Math.max(-60.0, Math.min(60.0, 5.0 * x));
        return 1.0 / (1.0 + Math.exp(-x));
    },
    tanh: function (x) {
        x = Math.max(-60.0, Math.min(60.0, 2.5 * x));
        return Math.tanh(x);
    },
    sin: function (x) {
        x = Math.max(-60.0, Math.min(60.0, 2.5 * x));
        return Math.sin(x);
    },
    gauss: function (x) {
        x = Math.max(-3.4, Math.min(3.4, x));
        return Math.exp(-5.0 * Math.pow(x, 2));
    },
    relu: function (x) {
        return x > 0.0 ? x : 0.0;
    },
    elu: function (x) {
        return x > 0.0 ? x : Math.exp(x) - 1;
    },
    lelu: function (x) {
        let leaky = 0.005;
        return x > 0.0 ? x : leaky * x;
    },
    selu: function (x) {
        let lam = 1.0507009873554804934193349852946;
        let alpha = 1.6732632423543772848170429916717;
        return x > 0.0 ? lam * x : lam * alpha * (Math.exp(x) - 1);
    },
    softplus: function (x) {
        x = Math.max(-60.0, Math.min(60.0, 5.0 * x));
        return 0.2 * Math.log(1 + Math.exp(x));
    },
    identity: function (x) {
        return x;
    },
    clamped: function (x) {
        return Math.max(-1.0, Math.min(1.0, x));
    },
    inv: function (x) {
        let y = 1.0 / x;
        return y === Infinity ? 0.0 : y;
    },
    log: function (x) {
        x = Math.max(1e-7, x);
        return Math.log(x);
    },
    exp: function (x) {
        x = Math.max(-60.0, Math.min(60.0, x));
        return Math.exp(x);
    },
    abs: function (x) {
        return Math.abs(x);
    },
    hat: function (x) {
        return Math.max(0.0, 1 - Math.abs(x));
    },
    square: function (x) {
        return Math.pow(x, 2);
    },
    cube: function (x) {
        return Math.pow(x, 3);
    }
};