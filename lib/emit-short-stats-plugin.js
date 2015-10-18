/**
 * Emits short stats (js and css files emitted) to file `current.verison`
 *
 * The purpose is to persist state even after the compilation is complete. This
 * file can be used to transfer the current state of compilation on a deployment
 * machine using an external program - like upload assets to CDN, inform other
 * services in your network the current version of compilation, etc...
 *
 * Example:
 *
 *   > plugins: [new EmitShortStatsPlugin()]
 *
 *   < // file = current.version
 *   < {
 *   <   js: ['app.198uhc92h323239c.bundle.js'],
 *   <   css: ['bundle.208asndf082nasldk23.css'],
*    <   images: ['example-f1df98cf.png']
 *   < }
 *
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _webpackLibRawSource = require('webpack/lib/RawSource');

var _webpackLibRawSource2 = _interopRequireDefault(_webpackLibRawSource);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var EmitShortStatsPlugin = (function () {
  function EmitShortStatsPlugin() {
    _classCallCheck(this, EmitShortStatsPlugin);
  }

  EmitShortStatsPlugin.prototype.apply = function apply(compiler) {
    compiler.plugin('after-compile', function (compilation, callback) {
      var cssArray = [],
          jsArray = [],
          jsFiles = {},
          imgArray = [],
          imgRegExp = /\.(gif|jpg|jpeg|png|webp|svg)$/i;

      Object.keys(compilation.assets).map(function (a) {
        var ext = _path2['default'].extname(a);
        switch (true) {
          case ext === '.js':
            jsFiles[a.split('.')[0]] = a;
            break;
          case ext === '.css':
            cssArray.push(a);
            break;
          case imgRegExp.test(ext):
            imgArray.push(a);
            break;
          default:
          // do nothing
        }
      });

      // TODO: support chunks
      jsArray.push(jsFiles['app']);

      var current = {
        js: jsArray,
        css: cssArray,
        images: imgArray
      };

      compilation.assets['current.version'] = new _webpackLibRawSource2['default'](JSON.stringify(current));
      callback();
    });
  };

  return EmitShortStatsPlugin;
})();

exports['default'] = EmitShortStatsPlugin;
module.exports = exports['default'];