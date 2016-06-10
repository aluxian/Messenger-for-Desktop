gulp = require 'gulp'
fs = require 'fs-extra-promise'
{platform} = require './utils'
electronDownloader = require 'gulp-electron-downloader'
manifest = require '../src/package.json'
args = require './args'

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
  [platformName, arch, dist, outputDir] = release

  gulp.task 'download:' + dist, ['kill:' + dist], (done) ->
    # Skip if already downloaded to speed up auto-reload
    if downloaded[dist]
      if args.verbose
        console.log 'already downloaded, skipping'
      return done()

    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN or process.env.GITHUB_OAUTH_TOKEN
    process.env.GITHUB_OAUTH_TOKEN = process.env.GITHUB_OAUTH_TOKEN or process.env.GITHUB_TOKEN

    electronDownloader
      version: manifest.electronVersion
      cacheDir: './cache'
      outputDir: outputDir
      platform: platformName
      arch: arch
    , (err) ->
      return done err if err
      downloaded[dist] = true

      # Also rename the .app on darwin
      if dist is 'darwin64'
        fs.rename './build/darwin64/Electron.app', './build/darwin64/' + manifest.productName + '.app', done
      else
        done()

# Download for the current platform by default
gulp.task 'download', ['download:' + platform()]
