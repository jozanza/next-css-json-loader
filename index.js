let CTX;

const path = require('path');

const url = require('url');

const css = require('css');

const toDataURI = require('datauri').sync;

const merge = (a, b) => Object.assign({}, a, b);

const camelize = a => a.replace(/-([a-z])/g, b => b[1].toUpperCase());

const transformers = {
  declarations: (a, b) => {
    const c = {};
    if (b.property === 'src') {
      const value = b.value
        .split(' ')
        .map(x => !x.startsWith('url')
          ? x
          : x.match(/\(([^)]+)\)/g)
            .map(src => src.substr(2, src.length - 4))
            .map(src => {
              const _src = url.parse(path.join(CTX, src))
              return _src.pathname.startsWith('http')
                ? `url("${src}")`
                : `url("${toDataURI(_src.pathname)}")`
            })
            .filter(x => x))
        .join(' ')
      c[camelize(b.property)] = value
    } else {
      c[camelize(b.property)] = b.value;
    }
    return merge(a, c);
  },
  rule: (a, b) => {
    const c = {};
    c[b.selectors.join(',')] = b
      .declarations
      .reduce(transformers.declarations, {});
    return merge(a, c);
  },
  charset: (a, b) => {
    const c = {};
    c['@charset'] = b.charset;
    return c;
  },
  'font-face': (a, b) => {
    const c = b
      .declarations
      .reduce(transformers.declarations, {});
    return merge(a, c);
  },
  media: (a, b) => {
    const c = {};
    c[`@media${b.media}`] = b
      .rules
      .reduce(transformers.rule, {});
    return merge(a, c);
  },
  keyframes: (a, b) => {
    const c = [];
    c[0] = b.name;
    c[1] = b.keyframes
      .map(x => ({
        selectors: x.values,
        declarations: x.declarations
      }))
      .reduce(transformers.rule, {});
    return c;
  },
};

const joinRules = (styles, rule) => {
  if (!transformers[rule.type])
    throw new Error(`Could not transform CSS rule: ${JSON.stringify(rule, null, 2)}`);
  return transformers[rule.type](styles, rule);
};

const transformRule = x => [
  x.type,
  joinRules(x.type === 'keyframes' ? [] : {}, x)
];

const transform = text => css
  .parse(text)
  .stylesheet
  .rules
  .map(transformRule)
  .reduce((acc, [type, rule]) => {
    if (type === 'keyframes') {
      // dedupe animations
      acc.keyframes = acc.keyframes
        .filter(x => x[0] !== rule[0]);
    }
    acc[camelize(type)].push(rule);
    return acc;
  }, {
      charset: [],
      fontFace: [],
      rule: [],
      media: [],
      keyframes: []
    });

module.exports = function loader(content) {
  CTX = this.context
  if (this.cacheable) this.cacheable();
  const styles = transform(content);
  styles.raw = content;
  const _exports = Object.keys(styles).map(k => `export const ${k} = ${JSON.stringify(styles[k])}`);
  const _default = JSON.stringify(styles.rule.concat(styles.media).reduce((a, b) => merge(a, b), {}));
  return _exports.join('\n') + '\nexport default' + _default;
};
