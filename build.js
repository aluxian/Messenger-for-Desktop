var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
  files: './src/**',
  platforms: ['win', 'osx', 'linux'],
  macIcns: './app_icon.icns',
  macZip: true
});

nw.on('log', console.log);

nw.build().then(function() {
  console.log('Building complete!');
}).catch(function(err) {
  console.error(err);
});
