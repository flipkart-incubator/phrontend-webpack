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

export default function loadersFromMap(loadersMap) {
  let loaders = [];

  for (let [key, value] of loadersMap) {
    if ('string' === typeof key)
      loaders.push({
        test: new RegExp(
          key.split('|').length > 1 ? `\\.(${key})$` : `\\.${key}$`
        ),
        loader: value
      });
    else
      loaders.push({
        test: key,
        loader: value
      });
  }

  return loaders;
}
