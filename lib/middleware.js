'use strict';

exports.__esModule = true;
exports['default'] = Middleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

// import CachePlugin from 'webpack/lib/CachePlugin';

var _webpackLibProgressPlugin = require('webpack/lib/ProgressPlugin');

var _webpackLibProgressPlugin2 = _interopRequireDefault(_webpackLibProgressPlugin);

var outputOptions = {
  colors: true,
  hash: true,
  timings: true,
  assets: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: false
};

function Middleware(config) {

  var compiler = _webpack2['default'](config);

  // show progress
  compiler.apply(new _webpackLibProgressPlugin2['default'](function (percentage, msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
  }));

  return _webpackDevMiddleware2['default'](compiler, {
    stats: outputOptions
  });
}

module.exports = exports['default'];