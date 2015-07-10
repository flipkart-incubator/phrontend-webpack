import makeconf from '../';
import assert from 'assert';
import Extract from 'extract-text-webpack-plugin';

describe('separateStylesheet', function(){

	it('should contain Extract plugin when true', function(){
		const separateStylesheet = true;
		let config = makeconf({src: __dirname, separateStylesheet});
		assert(config.plugins.reduce((p,c) => p ? p : c instanceof Extract, false));
	});

});
