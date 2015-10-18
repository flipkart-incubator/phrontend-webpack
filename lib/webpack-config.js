'use strict';

exports.__esModule = true;
exports['default'] = MakeWebpackConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

// webpack plugins

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _restrictCssImportsPlugin = require('./restrict-css-imports-plugin');

var _restrictCssImportsPlugin2 = _interopRequireDefault(_restrictCssImportsPlugin);

// Postcss plugins

var _postcssNested = require('postcss-nested');

var _postcssNested2 = _interopRequireDefault(_postcssNested);

var _cssnext = require('cssnext');

var _cssnext2 = _interopRequireDefault(_cssnext);

var _postcssMixins = require('postcss-mixins');

var _postcssMixins2 = _interopRequireDefault(_postcssMixins);

var _postcssSimpleVars = require('postcss-simple-vars');

var _postcssSimpleVars2 = _interopRequireDefault(_postcssSimpleVars);

// Custom stuff

var _cssLoader = require('./css-loader');

var _cssLoader2 = _interopRequireDefault(_cssLoader);

var _jsLoader2 = require('./js-loader');

var _jsLoader3 = _interopRequireDefault(_jsLoader2);

var _loadersFromMap = require('./loaders-from-map');

var _loadersFromMap2 = _interopRequireDefault(_loadersFromMap);

function isAbsolute(p) {
  return _path2['default'].resolve(p) === _path2['default'].normalize(p);
}

function MakeWebpackConfig(options) {

  // validations
  if ('string' !== typeof options.src) throw new Error('src should be a string');
  if (!isAbsolute(options.src)) throw new Error('src should be an absolute path');

  var src = options.src;
  var dest = options.dest || 'public';

  // if the destination is a relative path,
  // then make it relative to `src`
  if (!isAbsolute(dest)) dest = _path2['default'].join(src, dest);

  // we now support only one entry point - app, and is always fixed to index.js
  // an enhancement would be to read `src`/package.json .main
  var entry = { app: _path2['default'].join(src, 'index.js') };

  var output = {
    library: options.library || 'phrontend',
    // this can be passed in as an option
    // but why?, just increases the number of opts
    // where, with this we're trying to reduce it
    libraryTarget: 'umd',
    path: dest,
    publicPath: options.publicPath || 'public/',
    filename: options.minimize ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    pathinfo: !options.minimize
  };

  var devtool = options.devtool || 'cheap-module-inline-source-map';

  // loaders
  var loaders = new Map();
  loaders.set('json', options.hot ? 'react-hot!json' : 'json');
  loaders.set('png|jpg|jpeg|gif|svg', options.minimize ? 'image-size?name=[name]-[hash:8].[ext]' : 'image-size');
  loaders.set('css', _cssLoader2['default'](options, _extractTextWebpackPlugin2['default'].extract));
  // scope it inside a block, so that,
  // key and value aren't leaked to the outer scope
  {
    var _jsLoader = _jsLoader3['default'](options);

    var key = _jsLoader.key;
    var value = _jsLoader.value;

    loaders.set(key, value);
  }

  // cssnext should be the first plugin
  // includes postcss-imports and autoprefixer
  var postcss = [_cssnext2['default']({
    browsers: options.browsers,
    url: false
  }), _postcssSimpleVars2['default'], _postcssMixins2['default'], _postcssNested2['default']];

  // the default resolve dir is the node_modules directory under
  // the application's root - `src`
  // NOTE: always append to this, and never replace it
  var resolve = {
    root: [_path2['default'].join(src, 'node_modules')]
  };

  // again, scope it to block it leaking to outer scope
  {
    var mds = [];
    if (Array.isArray(options.moduleDirectories)) mds = mds.concat(options.moduleDirectories);else if ('string' === typeof options.moduleDirectories) mds.push(options.moduleDirectories);
    mds.map(function (md) {
      return resolve.root.push(isAbsolute(md) ? md : _path2['default'].join(src, md));
    });
  }

  // the default loaders are required from this project
  // if you're planning to append to loaders,
  // always apppend to it and never replace it
  var resolveLoader = {
    root: [_path2['default'].join(__dirname, '..', 'node_modules')]
  };

  // we always pass NODE_ENV as most of the libraries use it in such a way that
  // if blocks can be optimized with uglifyjs other optimizations are within
  // these conditional blocks
  var plugins = [new _webpack2['default'].DefinePlugin({
    'process.env': { 'NODE_ENV': JSON.stringify(process.env.NODE_ENV) }
  })];

  // by default, you'll be able to require css only from the same directory
  // as the js file. This is because, the entire project was built with
  // components in mind, and components are best written with all the entities
  // used to define the look, feel and functionality of the component
  // stay very close to each other
  var cssLocalImports = true;
  if ('undefined' !== typeof options.cssLocalImports) cssLocalImports = !!options.cssLocalImports;

  if (cssLocalImports) plugins.push(new _restrictCssImportsPlugin2['default']());

  if (options.separateStylesheet) plugins.push(new _extractTextWebpackPlugin2['default'](options.minimize ? 'bundle.[contenthash:20].css' : 'bundle.css', { allChunks: true }));

  if (options.minimize) plugins.push(new _webpack2['default'].optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    }
  }));

  // The proper way to dedupe would be,
  // 1. use npm@3 which flattens the tree
  // 2. use npm dedupe which dedupes and informs you which can't be deduped
  // 3. if you still feel you'd like to use DedupePlugin, send in an option
  if (options.dedupe) plugins.push(new _webpack2['default'].optimize.DedupePlugin());

  return {
    entry: entry,
    output: output,
    devtool: devtool,
    module: {
      loaders: _loadersFromMap2['default'](loaders)
    },
    postcss: postcss,
    debug: !!options.debug,
    resolve: resolve,
    resolveLoader: resolveLoader,
    plugins: plugins,
    devServer: {
      noInfo: false,
      hot: !!options.hot,
      inline: !!options.hot,
      historyApiFallback: true,
      stats: {
        colors: true
      }
    }
  };
}

module.exports = exports['default'];