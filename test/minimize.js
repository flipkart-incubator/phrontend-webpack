import makeconf from '../';
import assert from 'assert';
import should from 'should';
import webpack from 'webpack';
import cssLoader from '../lib/css-loader';
import Extract from 'extract-text-webpack-plugin';

describe('minimize', function() {

  describe('when not defined / false by default', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname });
    });
    after(function() {
      config = void 0;
    });
    it('should not contain hashes in filenames', function() {
      should(config.output.filename).equal('[name].bundle.js');
    });
    it('should not contain uglifyjs plugin', function() {
      assert(!config.plugins.reduce((p,c) => p ? p : c instanceof webpack.optimize.UglifyJsPlugin, false));
    });
    it('should contain long class names- with path, name and local', function() {
      let loaders = cssLoader({});
      should(loaders).match(/localIdentName(.*)\[path\](.*)\[name\](.*)\[local\]/);
    });
  });

  describe('when true', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname, minimize: true });
    });
    after(function() {
      config = void 0;
    });
    it('should contain hashes in filenames', function() {
      should(config.output.filename).equal('[name].[chunkhash].bundle.js');
    });
    it('should contain uglifyjs plugin', function() {
      assert(config.plugins.reduce((p,c) => p ? p : c instanceof webpack.optimize.UglifyJsPlugin, false));
    });
    it('should not contain long class names', function() {
      let loaders = cssLoader({ minimize: true }, noop => noop);
      should(loaders).not.match(/localIdentName(.*)\[path\]/);
      should(loaders).not.match(/localIdentName(.*)\[name\]/);
      should(loaders).not.match(/localIdentName(.*)\[local\]/);
    });
    it('should include extract plugin and contain hash in css filename', function() {
      let config = makeconf({
        src: __dirname,
        minimize: true,
        separateStylesheet: true
      });
      let extract = config.plugins.reduce((p,c) => p ? p : (c instanceof Extract ? c : false), false);
      assert(extract !== void 0)
      should(extract.filename).equal('bundle.[chunkhash].css');
    });
  });

  it('should negate pathinfo in output', function() {
    let minimize=false;
    let c1 = makeconf({ src: __dirname, minimize });
    let c2 = makeconf({ src: __dirname, minimize: !minimize });
    should(c1.output.pathinfo).equal(!minimize);
    should(c2.output.pathinfo).equal(minimize);
  });

});
