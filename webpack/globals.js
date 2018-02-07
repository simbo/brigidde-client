const env = require('./env');

/**
 * Global-scope variables available in all scripts, styles and templates
 */
const globals = {
  ...env,
  APP_SERVER_HOST: process.env.APP_SERVER_HOST || 'localhost',
  APP_SERVER_PORT: parseInt(process.env.APP_SERVER_PORT, 10) || 3000,
  APP_SERVER_SSL: process.env.APP_SERVER_SSL === 'true'
};

module.exports = { globals };
