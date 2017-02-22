const jsonify = require('jsonify-css');

module.exports = function loader(content) {
  if (this.cacheable) this.cacheable();
  const styles = Object.assign({ raw: content }, jsonify({ root: this.context })(content));
  const _exports = Object.keys(styles).map(k => `export const ${k} = ${JSON.stringify(styles[k])}`);
  const _default = JSON.stringify(styles.rule.concat(styles.media).reduce((a, b) => Object.assign({}, a, b), {}));
  return _exports.join('\n') + '\nexport default ' + _default;
};
