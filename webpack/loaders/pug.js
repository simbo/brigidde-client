const { globals } = require('./../globals');

const pugLoader = {
  loader: 'pug-html-loader',
  options: {
    data: globals
  }
};

module.exports = { pugLoader };
