/**
 * Restricts the importing of css files from a different directory
 *
 * Usage:
 *   plugins: [ new RestrictPlugin() ]
 *
 *   require('./styles.css'); // => no error
 *   require('../../styles.css'); // => throws error
 *
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var RestrictPlugin = (function () {
  function RestrictPlugin() {
    _classCallCheck(this, RestrictPlugin);
  }

  RestrictPlugin.prototype.apply = function apply(compiler) {
    compiler.plugin('this-compilation', function (compilation) {
      compilation.plugin('normal-module-loader', function (loaderContext, module) {
        var userRequest = module.userRequest.split('!').pop();
        if (_path2['default'].extname(module.userRequest) === '.css') {
          var issuer = module.issuer.split('!').pop();
          if (_path2['default'].dirname(issuer) !== _path2['default'].dirname(userRequest)) {
            throw new Error('\nRestricted - Stylesheets should be required from the same directory.\n\nRequested css  : ' + userRequest + '\nRequested from : ' + issuer + '\n');
          }
        }
      });
    });
  };

  return RestrictPlugin;
})();

exports['default'] = RestrictPlugin;
module.exports = exports['default'];