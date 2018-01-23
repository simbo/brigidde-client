const { join } = require('path');
const Dotenv = require('dotenv');
const Chalk = require('chalk');

Dotenv.config({
  path: join(__dirname, '.env'),
  encoding: 'utf8'
});

const { config } = require('./webpack/config');
const { NODE_ENV, IS_PRODUCTION } = require('./webpack/env');

console.log([
  Chalk.dim('NODE_ENV'),
  IS_PRODUCTION ? '👔 ' : '👷 ',
  Chalk[IS_PRODUCTION ? 'cyan' : 'yellow'](NODE_ENV)
].join(' '));

module.exports = config;
