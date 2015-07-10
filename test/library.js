import makeconf from '../';
import should from 'should';

describe('library', function() {

  it('should be umd and default to phrontend when not defined', function() {
    let config = makeconf({ src: __dirname });
    should(config.output.libraryTarget).equal('umd');
    should(config.output.library).equal('phrontend');
  });

  it('should be umd and set when defined', function() {
    const library = 'tiger';
    let config = makeconf({ src: __dirname, library });
    should(config.output.libraryTarget).equal('umd');
    should(config.output.library).equal(library);
  });

});
