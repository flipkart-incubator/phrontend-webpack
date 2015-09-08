// ES5
'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var Promise = require('promise');

var __DEV__ = process.env.NODE_ENV !== 'production';

var isBuildExists = function() {
  var src = path.join(__dirname, '..', 'src');
  var lib = path.join(__dirname, '..', 'lib');
  if (!fs.existsSync(lib)) return false;
  return fs.readdirSync(src).sort().join(',') === fs.readdirSync(lib).sort().join(',');
};

var run = function(cmd) {
  return new Promise(function(resolve, reject) {
    var p = exec('npm run ' + cmd, function(err, stdout, stderr) {
      if (err !== null) return reject(err);
      console.log(stdout.toString().trim());
      console.error(stderr.toString().trim());
      resolve();
    });
  });
};

if (__DEV__ && (process.env.npm_config_force_build || !isBuildExists())) {
  run('lint')
    .then(function() {
      return run('build');
    });
}
