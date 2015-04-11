var NodeWebkitBuilder = require('node-webkit-builder');
var archiver = require('archiver');
var async = require('async');
var fs = require('fs-extra');

var builder = new NodeWebkitBuilder({
  files: './src/**',
  platforms: ['win32', 'osx64', 'linux32', 'linux64'],
  macIcns: './app_icon.icns',
  winIco: 'app_icon.ico'
});

builder.on('log', console.log);

builder.build().then(function() {
  console.log('Building complete!');
  console.log('Cleaning ./dist');

  fs.emptyDir('./dist', function(error) {
    if (error) {
      console.log('Couldn\'t empty ./dist');
      console.error(error);
      return;
    }

    console.log('Archiving releases...');

    var archive = function(os, format) {
      return function(callback) {
        var output = fs.createWriteStream('./dist/messenger_' + os + '.' + format);
        var archive;

        if (format == 'zip') {
          archive = archiver(format);
        } else {
          archive = archiver('tar', { gzip: true });
        }

        output.on('close', function() {
          callback(null, 'Finished compression for ' + os);
        });

        archive.on('error', function(error) {
          callback(error);
        });

        archive.pipe(output);
        archive.bulk([{ expand: true, cwd: './build/Messenger/' + os, src: ['**'] }]);
        archive.finalize();
      };
    };

    async.parallel([
      archive('osx64', 'zip'),
      archive('win32', 'zip'),
      archive('linux32', 'tar.gz'),
      archive('linux64', 'tar.gz')
    ], function(error, messages) {
      if (error) {
        console.error(error);
      } else {
        messages.forEach(function(msg) {
          console.log(msg);
        });
      }

      console.log('Archiving complete!');
    });
  });
}).catch(function(error) {
  console.error(error);
});
