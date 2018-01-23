const env = require('./env');

/**
 * Global-scope variables available in all scripts, styles and templates
 */
const globals = {
  ...env,
  APP_SERVER_HOST: process.env.APP_SERVER_HOST || 'localhost',
  APP_SERVER_PORT: process.env.APP_SERVER_PORT || 3000
};

module.exports = { globals };
