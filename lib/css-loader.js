/**
 * Make the value of the tuple for css loader based on options
 *
 * Example:
 *
 *  > cssLoader({ hot: false, minimize: true })
 *  < Extract.extract('css?sourceMap&module!postcss')
 *
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

exports['default'] = function (options) {
  var cssLoader = 'css?modules';
  if (!options.minimize) cssLoader += '&localIdentName=[path][name]_[local]_[hash:base64:6]';

  var loader = cssLoader + '!postcss';
  var hotLoader = 'react-hot!style?singleton!' + loader;
  var separateStylesheet = _extractTextWebpackPlugin2['default'].extract(loader);
  var defaultLoader = 'style?singleton!' + loader;

  var hot = false;
  if (options.hot) if (!options.separateStylesheet) hot = true;

  if (hot) return hotLoader;else if (options.separateStylesheet) return separateStylesheet;
  return defaultLoader;
};

module.exports = exports['default'];