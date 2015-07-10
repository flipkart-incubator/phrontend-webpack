import makeconf from '../';
import path from 'path';
import should from 'should';

describe('dest', function() {

  it('should be defaulted to public when not defined', function() {
    let config = makeconf({ src: __dirname });
    should(config.output.path).equal(path.join(__dirname, 'public'));
  });

  it('should append to src for relative path', function() {
    const dest = 'build';
    let config = makeconf({ src: __dirname, dest });
    should(config.output.path).equal(path.join(__dirname, dest));
  });

  it('should be the same for absolute path', function() {
    const dest = '/opt/http-server/public';
    let config = makeconf({ src: __dirname, dest });
    should(config.output.path).equal(dest);
  });

});
