/**
 * Provides a dev server with all routes mapped to index.html and assets
 * mapped to webpack dev server
 *
 * Example:
 *
 *   > var devServer = require('phrontend-webpack/lib/dev-server');
 *   > devServer(require('./webpack.config'), {
 *   >   port: process.env.PORT || 3000
 *   > });
 *
 *   < creates two servers
 *   < 1. Express server
 *   <   - serves all routes except /public as index.html on PORT (3000)
 *   <   - proxies all /public requests to localhost:<PORT+1> (localhost:3001)
 *   < 2. Webpack dev server
 *   <   - serves static assets compiled on PORT+1 (3001)
 *
 */

import express from 'express';
import proxy from 'express-http-proxy';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import fs from 'fs';
import url from 'url';

export default function startServers(config, {port = 3000} = {}) {
  let app = express();

  app.use('/public', proxy(`localhost:${port + 1}`, {
    forwardPath: (req, res) => `/public/${url.parse(req.url).path}`
  }));

  app.get('/*', (req, res) => res.end(fs.readFileSync('index.html')));

  let server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath
  });

  server.listen(port + 1, 'localhost', () => console.log(`webpack-dev-server listening on port ${port + 1}`));

  app.listen(port, () => console.log(`express server listening on port ${port}`));
}
