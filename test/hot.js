import makeconf from '../';
import assert from 'assert';
import should from 'should';
import webpack from 'webpack';
import cssLoader from '../lib/css-loader';
import Extract from 'extract-text-webpack-plugin';

// json loader - react-hot when true
// output devserver - hot
// cssloader - no react-hot when hot = false
// cssloader - no react-hot when hot = true, separateStylesheet = true
// cssloader - react-hot when hot = true, separateStylesheet = false
// jsloader - react-hot when true

describe('hot', function() {
  describe('when not defined / default false', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname });
    });
    after(function() {
      config = void 0;
    });
    it('should set devServer options hot and inline to false', function() {
      should(config.devServer.hot).equal(false);
      should(config.devServer.inline).equal(false);
    });
    it('should not include react-hot in any of the loaders - json, css, js', function() {
      config.module.loaders.map(l => should(l.loader).not.match(/react-hot/))
    });
  });

  describe('when true', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname, hot: true });
    });
    after(function() {
      config = void 0;
    });
    it('should set devServer options hot and inline to true', function() {
      should(config.devServer.hot).equal(true);
      should(config.devServer.inline).equal(true);
    });
    it('should include react-hot in all loaders', function() {
      let supports = ['css', 'js', 'json'];
      let loaders = config.module.loaders.filter(l =>
        supports.reduce((p,c) => p ? p : l.test.toString().includes(c), false));
      loaders.map(l => should(l.loader).match(/react-hot/));
    });
    it('should not include hot when separateStylesheet is true', function() {
      let loader = cssLoader({ hot: true, separateStylesheet: true });
      should(loader).not.match(/react-hot/);
    });
  });
});
