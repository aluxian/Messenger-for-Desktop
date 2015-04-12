var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
  files: './src/**',
  platforms: ['linux64', 'linux32', 'win32', 'osx64'],
  macIcns: './app_icon.icns'
});

nw.on('log', console.log);

nw.build().then(function() {
  console.log('Building complete!');
}).catch(function(err) {
  console.error(err);
});
