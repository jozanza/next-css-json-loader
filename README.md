> **DEPRECATION NOTICE:** `next-css-json-loader` is deprecated in favor of [babel-plugin-jsonfy-css](https://github.com/jozanza/babel-plugin-jsonify-css). Please use it instead. Thank you!

# next-css-json-loader

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url] [![Coverage Status][coveralls-image]][coveralls-url]

[npm-url]:https://npmjs.org/package/next-css-json-loader
[downloads-image]:http://img.shields.io/npm/dm/next-css-json-loader.svg
[npm-image]:http://img.shields.io/npm/v/next-css-json-loader.svg
[travis-url]:https://travis-ci.org/jozanza/next-css-json-loader
[travis-image]:http://img.shields.io/travis/jozanza/next-css-json-loader/master.svg
[david-dm-url]:https://david-dm.org/jozanza/next-css-json-loader
[david-dm-image]:https://img.shields.io/david/jozanza/next-css-json-loader.svg
[david-dm-dev-url]:https://david-dm.org/jozanza/next-css-json-loader#info=devDependencies
[david-dm-dev-image]:https://img.shields.io/david/dev/jozanza/next-css-json-loader.svg
[coveralls-image]:https://coveralls.io/repos/github/jozanza/next-css-json-loader/badge.svg?branch=master
[coveralls-url]:https://coveralls.io/github/jozanza/next-css-json-loader?branch=master

## Installation

`$ npm install --save-dev next-css-json-loader`


## Setup

First you will need to create a `next.config.js` file:

```js
module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.css$/,
      loader: 'emit-file-loader',
      options: {
        name: 'dist/[path][name].[ext]',
      }
    }, {
      test: /\.css$/,
      loader: 'babel-loader!next-css-json-loader',
    });
    return config;
  },
};
```

## Usage

After setting the project, you may import CSS files like so:

```js
// .css files now conveniently expose all styles as js objects
import styles, {
  rule,
  media,
  keyframes,
  fontFace,
  charset,
  raw
} from 'some-package/foo.css';

// If you are using glamor, you can easily generate styles like so
import { css } from 'glamor';
const className = css(styles);

// Don't forget any custom fonts or animations :)
const fonts = fontFace.map(x => css.fontFace(x));
const animations = keyframes.reduce((a, [name, timeline]) => {
  a[name] = css.keyframe(timeline);
  return a;
}, {});

```

Shout out to [next-style-loader](https://github.com/moxystudio/next.js-style-loader) for inspiration!

## License

[MIT License](http://opensource.org/licenses/MIT)
