import makeconf from '../';
import should from 'should';

describe('debug', function() {
  it('should be false when not defined', function(){
    let config = makeconf({ src: __dirname});
    should(config.debug).equal(false);
  });

  it('should be the same when defined', function(){
  	const debug = true
    let config = makeconf({ src:__dirname, debug});
    should(config.debug).equal(debug);
  });

});
