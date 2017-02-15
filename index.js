const parse = require('./parse');
const _ = require('./utils');

module.exports = function loader(content) {
  if (this.cacheable) this.cacheable();
  const styles = Object.assign({ raw: content }, parse(this.context)(content));
  const _exports = Object.keys(styles).map(k => `export const ${k} = ${JSON.stringify(styles[k])}`);
  const _default = JSON.stringify(styles.rule.concat(styles.media).reduce((a, b) => _.merge(a, b), {}));
  return _exports.join('\n') + '\nexport default ' + _default;
};
