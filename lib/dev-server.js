/**
 * Provides a dev server with all routes mapped to index.html and assets
 * mapped to webpack dev server
 *
 * Example:
 *
 *   > var devServer = require('phrontend-webpack/lib/dev-server');
 *   > devServer(require('./webpack.config'), {
 *   >   port: process.env.PORT || 3000
 *   > });
 *
 *   < creates two servers
 *   < 1. Express server
 *   <   - serves all routes except /public as index.html on PORT (3000)
 *   <   - proxies all /public requests to localhost:<PORT+1> (localhost:3001)
 *   < 2. Webpack dev server
 *   <   - serves static assets compiled on PORT+1 (3001)
 *
 */

'use strict';

exports.__esModule = true;
exports['default'] = startServers;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function startServers(config) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$port = _ref.port;
  var port = _ref$port === undefined ? 3000 : _ref$port;

  var app = _express2['default']();

  app.use('/public', _expressHttpProxy2['default']('localhost:' + (port + 1), {
    forwardPath: function forwardPath(req, res) {
      return '/public/' + _url2['default'].parse(req.url).path;
    }
  }));

  app.get('/*', function (req, res) {
    return res.end(_fs2['default'].readFileSync('index.html'));
  });

  var server = new _webpackDevServer2['default'](_webpack2['default'](config), {
    publicPath: config.output.publicPath
  });

  server.listen(port + 1, 'localhost', function () {
    return console.log('webpack-dev-server listening on port ' + (port + 1));
  });

  app.listen(port, function () {
    return console.log('express server listening on port ' + port);
  });
}

module.exports = exports['default'];