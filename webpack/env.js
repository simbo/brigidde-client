const NODE_ENV = ((env) => {
  switch (env) {
    case 'prod':
    case 'production':
      return 'production';
    default:
      return 'development';
  }
})(process.env.NODE_ENV)

const IS_PRODUCTION = NODE_ENV === 'production';

const IS_DEVELOPMENT = NODE_ENV === 'development';

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT
};
