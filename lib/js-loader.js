/**
 * Create the tuple for JS loader - transpiling
 *
 *   > JsLoader({ hot: true });
 *   < { key: fn, value: 'react-hot!babel'}
 *
 */

'use strict';

exports.__esModule = true;
exports['default'] = JsLoader;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function JsLoader(options) {
  var transpile = [];
  if ('string' === typeof options.transpile) transpile.push(options.transpile);else if (Array.isArray(options.transpile)) transpile = transpile.concat(options.transpile);

  // The test function to be used for loading js files
  // 1. transpile js files of app
  // 2. transpile js files that present in transpile[]
  // 3. don't transpile anything else
  var key = function key(p) {
    if (_path2['default'].extname(p) !== '.js') return false;
    for (var i = 0; i < transpile.length; i++) {
      var cur = _path2['default'].join('node_modules', transpile[i]);
      var sub = _path2['default'].join(cur, 'node_modules');
      if (p.indexOf(sub) !== -1) return false;else if (p.indexOf(cur) !== -1) return true;
    }
    if (p.indexOf('node_modules') !== -1) return false;
    return true;
  };

  var value = options.hot ? 'react-hot!babel' : 'babel';

  return { key: key, value: value };
}

module.exports = exports['default'];