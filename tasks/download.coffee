gulp = require 'gulp'
asar = require 'gulp-asar'

electronDownloader = require 'gulp-electron-downloader'
manifest = require '../src/package.json'

# Download the Electron binary for a platform
[
  ['darwin', 'x64', 'darwin64', './build/darwin64']
  ['linux', 'ia32', 'linux32', './build/linux32/opt/' + manifest.name]
  ['linux', 'x64', 'linux64', './build/linux64/opt/' + manifest.name]
  ['win32', 'ia32', 'win32', './build/win32']
].forEach (release) ->
  [platform, arch, dist, outputDir] = release

  gulp.task 'download:' + dist, (done) ->
    electronDownloader
      version: 'v0.29.0'
      cacheDir: './cache'
      outputDir: outputDir
      platform: platform
      arch: arch
    , done

# Download the Electron binaries for all platforms
gulp.task 'download', [
  'download:darwin64'
  'download:linux32'
  'download:linux64'
  'download:win32'
]
