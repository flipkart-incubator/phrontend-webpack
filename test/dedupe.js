import makeconf from '../';
import assert from 'assert';
import webpack from 'webpack';

describe('dedupe', function() {

	it('should contain dedupe plugin when true', function(){
		let config = makeconf({ src: __dirname, dedupe: true });
		assert(config.plugins.reduce((p,c) => p ? p : c instanceof webpack.optimize.DedupePlugin, false));
	});

});
