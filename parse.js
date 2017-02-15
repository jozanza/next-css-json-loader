const css = require('css');
const transformers = require('./transformers');
const _ = require('./utils');

const joinRules = ctx => (styles, rule) => {
  const type = _.camelize(rule.type);
  if (!transformers[type])
    throw new Error(`Could not transform CSS rule: ${JSON.stringify(rule, null, 2)}`);
  return transformers[type](ctx)(styles, rule);
};

const transformRule = ctx => x => [
  _.camelize(x.type),
  joinRules(ctx)(x.type === 'keyframes' ? [] : {}, x)
];

const mergeStyles = (acc, val) => {
  const type = val[0];
  const rule = val[1];
  if (type === 'keyframes') // dedupe animations
    acc.keyframes = acc.keyframes.filter(x => x[0] !== rule[0]);
  if (!acc[type]) console.log(type)
  acc[type].push(rule);
  return acc;
};

module.exports = ctx => text => css
  .parse(text)
  .stylesheet
  .rules
  .map(transformRule(ctx))
  .reduce(mergeStyles, {
    charset: [],
    fontFace: [],
    rule: [],
    media: [],
    keyframes: []
  });
