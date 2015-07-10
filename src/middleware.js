import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
// import CachePlugin from 'webpack/lib/CachePlugin';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';

let outputOptions = {
  colors: true,
  hash: true,
  timings: true,
  assets: true,
  chunks: false,
  chunkModules: false,
  modules: false,
  children: false
};

export default function Middleware(config) {

  let compiler = webpack(config);

  // show progress
  compiler.apply(new ProgressPlugin(function(percentage, msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(msg);
  }));

  return webpackMiddleware(compiler, {
    stats: outputOptions
  });

}
