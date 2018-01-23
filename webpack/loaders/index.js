const { postcssLoader } = require('./postcss');
const { stylusLoader } = require('./stylus');
const { pugLoader } = require('./pug');

const loaders = {
  postcss: postcssLoader,
  stylus: stylusLoader,
  pug: pugLoader
};

module.exports = { loaders };
