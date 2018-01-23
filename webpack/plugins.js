const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NamedChunksPlugin = require('webpack/lib/NamedChunksPlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const Path = require('path');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');

const { globals } = require('./globals');
const { NODE_ENV, IS_PRODUCTION } = require('./env');
const { paths } = require('./paths');

const plugins = [

  // define global constants
  new DefinePlugin({
    ...Object.keys(globals).reduce((data, key) => {
      data[key] = JSON.stringify(globals[key]);
      return data;
    }, {}),
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV)
    }
  }),

  // chunk occurence count optimization
  new OccurrenceOrderPlugin(),

  // shimmed global-scope libs
  new ProvidePlugin({
  }),

  // separate chunk for polyfills
  new CommonsChunkPlugin({
    name: 'polyfills',
    chunks: ['polyfills']
  }),

  // separate chunk for vendor modules
  new CommonsChunkPlugin({
    name: 'vendor',
    chunks: ['main'],
    minChunks: (module) => /node_modules/.test(module.resource)
  }),

  // extract webpack runtime code to extra chunk
  new CommonsChunkPlugin({
    name: 'manifest',
    minChunks: Infinity
  }),

  // provide context to angular's use of System.import
  // https://github.com/angular/angular/issues/11580
  // https://github.com/angular/angular/issues/20357
  new ContextReplacementPlugin(
    // /angular(\\|\/)core(\\|\/)@angular/,
    /\@angular(\\|\/)core(\\|\/)esm5/,
    paths.src()
  ),

  // extract global-scoped css
  new ExtractTextPlugin({
    filename: `styles/[name]${ IS_PRODUCTION? '.[contenthash]' : '' }.css`,
    allChunks: true
  }),

  // extract index.html
  new HtmlWebpackPlugin({
    template: paths.src('index.pug'),
    chunksSortMode: 'dependency',
    inject: 'body'
  }),

  // copy static assets
  new CopyWebpackPlugin([
    paths.src('assets', '**', '*'),
  ].map((glob) => ({
    from: {
      glob,
      dot: false
    },
    to: paths.dist(),
    context: paths.src()
  })), {
    ignore: [
    ]
  })

/**
 * Production-only plugins
 */

].concat(IS_PRODUCTION ? [

  // delete generated files before build
  new CleanWebpackPlugin([
    Path.resolve(paths.root(), paths.dist())
  ], {
    root: paths.root(),
    exclude: []
  }),

  // use consistent named chunks
  new NamedChunksPlugin(),

  // use consistent named modules
  new NamedModulesPlugin(),

  // generate deterministic hashes for chunks
  new WebpackMd5Hash(),

  // uglify
  new UglifyJsPlugin({
    sourceMap: true
  }),

  // // optional bundle analyzer service
  // new BundleAnalyzerPlugin({
  //   analyzerMode: 'server',
  //   analyzerHost: '0.0.0.0',
  //   analyzerPort: 9000,
  //   defaultSizes: 'gzip',
  //   openAnalyzer: false
  // })

] : []);

module.exports = { plugins };
