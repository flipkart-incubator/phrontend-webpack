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

import path from 'path';

export default class RestrictPlugin {
  apply(compiler) {
    compiler.plugin('this-compilation', function(compilation) {
      compilation.plugin('normal-module-loader', function(loaderContext, module) {
        var userRequest = module.userRequest.split('!').pop();
        if (path.extname(module.userRequest) === '.css') {
          var issuer = module.issuer.split('!').pop();
          if (path.dirname(issuer) !== path.dirname(userRequest)) {
            throw new Error(
              `
Restricted - Stylesheets should be required from the same directory.

Requested css  : ${userRequest}
Requested from : ${issuer}
`
            );
          }
        }
      });
    });
  }
}
