import makeconf from '../';
import should from 'should';

describe('publicPath', function() {
  it('should be public when not defined', function(){
    let config = makeconf({ src: __dirname });
    should(config.output.publicPath).equal('public/');
  });

  it('should reflect server url when defined', function(){
  	const CDNURL = 'http://img1a.flixcart.com/public';
  	let config = makeconf({ src: __dirname, publicPath: CDNURL});
  	should(config.output.publicPath).equal(CDNURL);
  });

});
