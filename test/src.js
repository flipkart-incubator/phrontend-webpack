import makeconf from '../';
import assert from 'assert';
import path from 'path';
import should from 'should';

describe('src', function() {

  it('should throw when not defined', function() {
    try {
      makeconf();
    } catch (e) {
      assert(e instanceof TypeError);
    }
  });

  it('should throw when not absolute path', function() {
    try {
      makeconf({ src: './app' });
    } catch (e) {
      assert(true);
    }
  });

  it('should return entry with app path', function() {
    let config = makeconf({ src: __dirname });
    should(config.entry.app).equal(path.join(__dirname, 'index.js'));
  });

});
