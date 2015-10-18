/**
 * Creates webpack loaders array from a ES2015 Map
 *
 * 1. One item <String> -> regex
 * 2. Multiple items <String> -> regex split by `|`
 * 3. Other types -> return as it is
 *
 * Example:
 *
 *   > let l = new Map();
 *   > l.set('js', 'react-hot!babel');
 *   > l.set('png|jpg', 'file');
 *   > l.set(p => path.extname(p) === '.css', 'postcss');
 *
 *   < [
 *   <   { test: /\.js$/, loader: 'react-hot!babel' },
 *   <   { test: /\.(png|jpg)$/, loader: 'file' },
 *   <   { test: p => path.extname(p) === '.css', loader: 'postcss' }
 *   < ]
 *
 */

'use strict';

exports.__esModule = true;
exports['default'] = loadersFromMap;

function loadersFromMap(loadersMap) {
  var loaders = [];

  for (var _iterator = loadersMap, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var key = _ref[0];
    var value = _ref[1];

    if ('string' === typeof key) loaders.push({
      test: new RegExp(key.split('|').length > 1 ? '\\.(' + key + ')$' : '\\.' + key + '$'),
      loader: value
    });else loaders.push({
      test: key,
      loader: value
    });
  }

  return loaders;
}

module.exports = exports['default'];