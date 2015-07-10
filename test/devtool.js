import makeconf from '../';
import should from 'should';

describe('devtool', function() {
  it('should be cheap when not defined', function(){
    let config = makeconf({ src: __dirname });
    should(config.devtool).equal('cheap-module-inline-source-map');
  });
  
  it('should be the same when defined', function(){
  	const devtool = 'eval';
    let config = makeconf({ src:__dirname, devtool});
    should(config.devtool).equal(devtool);
  });

});
