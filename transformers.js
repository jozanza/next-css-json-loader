const path = require('path');
const url = require('url');
const toDataURI = require('datauri').sync;
const _ = require('./utils');

const declarations = exports.declarations = ctx => (a, b) => {
  const c = {};
  if (b.property === 'src') {
    // convert rules like `src: url("path/to/local/file")` to data-uris
    const value = b.value
      .split(' ')
      .map(x => !x.startsWith('url')
        ? x
        : x.match(/\(([^)]+)\)/g)
          .map(src => src.substr(2, src.length - 4))
          .map(src => {
            const _src = url.parse(path.join(ctx, src));
            return _src.protocol
              ? `url("${src}")`
              : `url("${toDataURI(_src.pathname)}")`;
          })
          .filter(x => x))
      .join(' ')
    c[_.camelize(b.property)] = value
  } else {
    c[_.camelize(b.property)] = b.value;
  }
  return _.merge(a, c);
};

const rule = exports.rule = ctx => (a, b) => {
  const c = {};
  c[b.selectors.join(',')] = b
    .declarations
    .reduce(declarations(ctx), {});
  return _.merge(a, c);
};

const charset = exports.charset = ctx => (a, b) => {
  const c = {};
  c['@charset'] = b.charset;
  return c;
};

const fontFace = exports.fontFace = ctx => (a, b) => {
  const c = b
    .declarations
    .reduce(declarations(ctx), {});
  return _.merge(a, c);
};

const media = exports.media = ctx => (a, b) => {
  const c = {};
  c[`@media${b.media}`] = b
    .rules
    .reduce(rule(ctx), {});
  return _.merge(a, c);
};

const keyframes = exports.keyframes = ctx => (a, b) => {
  const c = [];
  c[0] = b.name;
  c[1] = b.keyframes
    .map(x => ({
      selectors: x.values,
      declarations: x.declarations
    }))
    .reduce(rule(ctx), {});
  return c;
};
