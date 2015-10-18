/**
 * Make the value of the tuple for css loader based on options
 *
 * Example:
 *
 *  > cssLoader({ hot: false, minimize: true })
 *  < Extract.extract('css?sourceMap&module!postcss')
 *
 */

import Extract from 'extract-text-webpack-plugin';

export default function (options) {
  let cssLoader = 'css?modules';
  if (!options.minimize)
    cssLoader += '&localIdentName=[path][name]_[local]_[hash:base64:6]';

  let loader = `${cssLoader}!postcss`;
  let hotLoader = `react-hot!style?singleton!${loader}`;
  let separateStylesheet = Extract.extract(loader);
  let defaultLoader = `style?singleton!${loader}`;

  let hot = false;
  if (options.hot) if (!options.separateStylesheet) hot = true;

  if (hot) return hotLoader;
  else if (options.separateStylesheet) return separateStylesheet;
  return defaultLoader;

}
