import makeconf from '../';
import assert from 'assert';
import should from 'should';
import RestrictCssImportsPlugin from '../lib/restrict-css-imports-plugin';

describe('cssLocalImports', function() {

  describe('when not defined / default true', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname });
    });
    after(function() {
      config = void 0;
    });
    it('should contain RestrictCssImportsPlugin', function() {
      assert(config.plugins.reduce((p,c) => p ? p : c instanceof RestrictCssImportsPlugin, false));
    });
  });

  describe('when false', function() {
    let config;
    before(function() {
      config = makeconf({ src: __dirname, cssLocalImports: false });
    });
    after(function() {
      config = void 0;
    });
    it('should not contain RestrictCssImportsPlugin', function() {
      assert(!config.plugins.reduce((p,c) => p ? p : c instanceof RestrictCssImportsPlugin, false));
    });
  });

});
