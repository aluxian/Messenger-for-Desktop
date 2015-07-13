fs = require 'fs-extra'
gulp = require 'gulp'

electronDownloader = require 'gulp-electron-downloader'
manifest = require '../src/package.json'

# Flags to keep track of downloads
downloaded =
  darwin64: false
  linux32: false
  linux64: false
  win32: false

# Download the Electron binary for a platform
[
  ['darwin', 'x64', 'darwin64', './build/darwin64']
  ['linux', 'ia32', 'linux32', './build/linux32/opt/' + manifest.name]
  ['linux', 'x64', 'linux64', './build/linux64/opt/' + manifest.name]
  ['win32', 'ia32', 'win32', './build/win32']
].forEach (release) ->
  [platform, arch, dist, outputDir] = release

  gulp.task 'download:' + dist, ['kill:' + dist], (done) ->
    # Skip if already downloaded to speed up auto-reload
    if downloaded[dist]
      return done()

    electronDownloader
      version: 'v0.29.0'
      cacheDir: './cache'
      outputDir: outputDir
      platform: platform
      arch: arch
    , ->
      downloaded[dist] = true

      # Also rename the .app on darwin
      if dist is 'darwin64'
        fs.rename './build/darwin64/Electron.app', './build/darwin64/' + manifest.productName + '.app', done
      else
        done()

# Download the Electron binaries for all platforms
gulp.task 'download', [
  'download:darwin64'
  'download:linux32'
  'download:linux64'
  'download:win32'
]
