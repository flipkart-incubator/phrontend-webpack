/**
 * Create the tuple for JS loader - transpiling
 *
 *   > JsLoader({ hot: true });
 *   < { key: fn, value: 'react-hot!babel'}
 *
 */

import path from 'path';

export default function JsLoader (options) {
  let transpile = [];
  if ('string' === typeof options.transpile)
    transpile.push(options.transpile);
  else if (Array.isArray(options.transpile))
    transpile = transpile.concat(options.transpile);

  // The test function to be used for loading js files
  // 1. transpile js files of app
  // 2. transpile js files that present in transpile[]
  // 3. don't transpile anything else
  let key = function(p) {
    if (path.extname(p) !== '.js') return false;
    for (let i = 0; i < transpile.length; i++) {
      let cur = path.join('node_modules', transpile[i]);
      let sub = path.join(cur, 'node_modules');
      if (p.indexOf(sub) !== -1) return false;
      else if (p.indexOf(cur) !== -1) return true;
    }
    if (p.indexOf('node_modules') !== -1) return false;
    return true;
  };

  let value = options.hot ? 'react-hot!babel' : 'babel';

  return { key, value };
}
