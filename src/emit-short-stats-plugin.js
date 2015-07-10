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
 *   <   css: ['bundle.208asndf082nasldk23.css']
 *   < }
 *
 */

import RawSource from 'webpack/lib/RawSource';
import path from 'path';

export default class EmitShortStatsPlugin {
  apply(compiler) {
    compiler.plugin('after-compile', function(compilation, callback) {
      var cssarray = [],
        jsarray = [],
        jsfiles = {};

      Object.keys(compilation.assets).map(function(a) {
        switch (path.extname(a)) {
          case '.js':
          jsfiles[a.split('.')[0]] = a;
          break;
          case '.css':
          cssarray.push(a);
          break;
          default:
          // do nothing
        }
      });

      // TODO: support chunks
      jsarray.push(jsfiles['app']);

      var current = {
        js: jsarray,
        css: cssarray
      };

      compilation.assets['current.version'] = new RawSource(JSON.stringify(current));
      callback();
    });
  }
}
