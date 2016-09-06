import path from 'path';
import webpack from 'webpack';

// webpack plugins
import Extract from 'extract-text-webpack-plugin';
import RestrictCssImportsPlugin from './restrict-css-imports-plugin';

// Postcss plugins
import PostcssNested from 'postcss-nested';
import cssnext from 'cssnext';
import PostcssMixins from 'postcss-mixins';
import PostcssSimpleVars from 'postcss-simple-vars';

// Custom stuff
import cssLoader from './css-loader';
import jsLoader from './js-loader';

import loadersFromMap from './loaders-from-map';

function isAbsolute(p) {
  return path.resolve(p) === path.normalize(p);
}

export default function MakeWebpackConfig(options) {

  // validations
  if ('string' !== typeof options.src)
    throw new Error('src should be a string');
  if (!isAbsolute(options.src))
    throw new Error('src should be an absolute path');

  let src = options.src;
  let dest = options.dest || 'public';

  // if the destination is a relative path,
  // then make it relative to `src`
  if (!isAbsolute(dest)) dest = path.join(src, dest);

  // we now support only one entry point - app, and is always fixed to index.js
  // an enhancement would be to read `src`/package.json .main
  let entry = { app: path.join(src, 'index.js') };

  let output = {
    library: options.library || 'phrontend',
    // this can be passed in as an option
    // but why?, just increases the number of opts
    // where, with this we're trying to reduce it
    libraryTarget: 'umd',
    path: dest,
    publicPath: options.publicPath || 'public/',
    filename: options.minimize ? '[name].[chunkhash].bundle.js' : '[name].bundle.js',
    pathinfo: !options.minimize
  };

  let devtool = options.devtool || 'cheap-module-inline-source-map';

  // loaders
  let loaders = new Map();
  loaders.set('json', options.hot ? 'react-hot!json' : 'json');
  loaders.set('png|jpg|jpeg|gif|svg', options.minimize ? 'image-size?name=[name]-[hash:8].[ext]' : 'image-size');
  loaders.set('css', cssLoader(options, Extract.extract));
  // scope it inside a block, so that,
  // key and value aren't leaked to the outer scope
  {
    let {key, value} = jsLoader(options);
    loaders.set(key, value);
  }

  // cssnext should be the first plugin
  // includes postcss-imports and autoprefixer
  let postcss = [
    cssnext({
      browsers: options.browsers,
      url: false
    }),
    PostcssSimpleVars,
    PostcssMixins,
    PostcssNested
  ];

  // the default resolve dir is the node_modules directory under
  // the application's root - `src`
  // NOTE: always append to this, and never replace it
  let resolve = {
    root: [
      path.join(src, 'node_modules')
    ]
  };

  // again, scope it to block it leaking to outer scope
  {
    let mds = [];
    if (Array.isArray(options.moduleDirectories))
      mds = mds.concat(options.moduleDirectories);
    else if ('string' === typeof options.moduleDirectories)
      mds.push(options.moduleDirectories);
    mds.map(md => resolve.root.push(isAbsolute(md) ? md : path.join(src, md)));
  }

  // the default loaders are required from this project
  // if you're planning to append to loaders,
  // always apppend to it and never replace it
  let resolveLoader = {
    root: [path.join(__dirname, '..', 'node_modules')]
  };

  // we always pass NODE_ENV as most of the libraries use it in such a way that
  // if blocks can be optimized with uglifyjs other optimizations are within
  // these conditional blocks
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify(process.env.NODE_ENV) }
    }),
    new webpack.IgnorePlugin(
      /components\/(.*)\/index.js/
    ),
    new webpack.NormalModuleReplacementPlugin(
      /components\/(.*)\/index.js/,
      o => {
        o.request = o.request.replace(
          /index.js$/,
          path.basename(path.dirname(o.userRequest)) + '.js'
        );
      }
    )
  ];

  // by default, you'll be able to require css only from the same directory
  // as the js file. This is because, the entire project was built with
  // components in mind, and components are best written with all the entities
  // used to define the look, feel and functionality of the component
  // stay very close to each other
  let cssLocalImports = true;
  if ('undefined' !== typeof options.cssLocalImports)
    cssLocalImports = !!options.cssLocalImports;

  if (cssLocalImports) plugins.push(new RestrictCssImportsPlugin());

  if (options.separateStylesheet) plugins.push(new Extract(
    options.minimize ? 'bundle.[contenthash:20].css' : 'bundle.css', { allChunks: true })
    );

  if (options.minimize) plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compress: {
      warnings: false,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true
    }
  }));

  // The proper way to dedupe would be,
  // 1. use npm@3 which flattens the tree
  // 2. use npm dedupe which dedupes and informs you which can't be deduped
  // 3. if you still feel you'd like to use DedupePlugin, send in an option
  if (options.dedupe) plugins.push(new webpack.optimize.DedupePlugin());

  return {
    entry,
    output,
    devtool,
    module: {
      loaders: loadersFromMap(loaders)
    },
    postcss,
    debug: !!options.debug,
    externals: options.externals || [],
    resolve,
    resolveLoader,
    plugins,
    devServer: {
      noInfo: false,
      hot: !!options.hot,
      inline: !!options.hot,
      historyApiFallback: true,
      stats: {
        colors: true
      }
    }
  };

}
