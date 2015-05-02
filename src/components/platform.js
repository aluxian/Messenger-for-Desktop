var platform = process.platform;
var arch = process.arch === 'ia32' ? '32' : '64';

platform = platform.indexOf('win') === 0 ? 'win'
         : platform.indexOf('darwin') === 0 ? 'osx'
         : 'linux';

module.exports = {
  isOSX: platform === 'osx',
  isWindows: platform === 'win',
  isLinux: platform === 'linux',
  name: platform + arch,
  type: platform,
  arch: arch
};
