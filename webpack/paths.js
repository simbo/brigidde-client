const Path = require('path');

const root = Path.dirname(__dirname);
const src = Path.join(root, 'src');
const dist = Path.join(root, 'dist');

const basePaths = {
  root,
  src,
  dist
};

const paths = {
  ...Object.keys(basePaths).reduce((pathFunctions, basePathName) => {
    pathFunctions[basePathName] = (...trailers) => Path.join(basePaths[basePathName], ...trailers);
    return pathFunctions;
  }, {})
};

module.exports = { paths };
