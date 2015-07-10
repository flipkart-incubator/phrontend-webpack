import makeconf from '../';
import path from 'path';
import should from 'should';

describe('moduleDirectories', function() {
	const dir = 'components';
	const dirs = ['images', 'stores'];

	describe('relative paths', function() {
		let c1, c2;
		before(function() {
			c1 = makeconf({ src: __dirname, moduleDirectories: dir });
			c2 = makeconf({ src: __dirname, moduleDirectories: dirs });
		});
		after(function() {
			c1 = void 0;
			c2 = void 0;
		});
		it('should treat path as relative to src', function() {
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, dir), false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, 'node_modules'), false);
		});
		it('should treat each path in array relative to src', function() {
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, dirs[0]), false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, dirs[1]), false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, 'node_modules'), false);
		});
	});

	describe('relative paths', function() {
		let c1, c2;
		let adir = path.join(__dirname, dir);
		let adirs = dirs.map(d => path.join(__dirname, d));
		before(function() {
			c1 = makeconf({ src: __dirname, moduleDirectories: adir });
			c2 = makeconf({ src: __dirname, moduleDirectories: adirs });
		});
		after(function() {
			c1 = void 0;
			c2 = void 0;
		});
		it('should treat path as relative to src', function() {
			c1.resolve.root.reduce((p,c) => p ? p : c === adir, false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, 'node_modules'), false);
		});
		it('should treat each path in array relative to src', function() {
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, adirs[0]), false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, adirs[1]), false);
			c1.resolve.root.reduce((p,c) => p ? p : c === path.join(__dirname, 'node_modules'), false);
		});
	});

});
