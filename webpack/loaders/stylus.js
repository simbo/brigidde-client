const stylus = require('stylus');

const { globals } = require('./../globals');
const { paths } = require('./../paths');

const stylusLoader = {
  loader: 'stylus-loader',
  options: {
    ...globals,
    paths: [
      paths.src('styles', 'imports')
    ],
    'include css': true,
    'inline-url': stylus.url({
      path: paths.src,
      limit: false
    })
  }
};

module.exports = { stylusLoader };
