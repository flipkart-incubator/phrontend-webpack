import makeconf from '../';
import should from 'should';

describe('browser', function(){

  it('should be passed to cssnext options when defined', function(){
    const browsers = ['Chrome > 34'];
    let config = makeconf({ src: __dirname, browsers });
    config.postcss[0].plugins.map(plugins=>{
      if(plugins.options){
        should(plugins.options.browsers).equal(browsers);
      }
    });
  });

})
