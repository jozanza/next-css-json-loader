const merge = exports.merge = (a, b) => Object.assign({}, a, b);

const camelize = exports.camelize = a => a.replace(/-([a-z])/g, b => b[1].toUpperCase());
