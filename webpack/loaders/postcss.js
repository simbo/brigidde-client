const autoprefixer = require('autoprefixer');
const cssMqpacker = require('css-mqpacker');
const cssnano = require('cssnano');

const { IS_PRODUCTION } = require('./../env');
const { browsers } = require('./../browsers');

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: [
      autoprefixer({
        browsers,
        remove: false
      }),
      cssMqpacker(),
      IS_PRODUCTION ? cssnano({
        zindex: false
      }) : null
    ].filter((plugin) => plugin !== null)
  }
};

module.exports = { postcssLoader };
