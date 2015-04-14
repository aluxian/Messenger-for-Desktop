gulp = require 'gulp'
shelljs = require 'shelljs'
runSequence = require 'run-sequence'
$ = require('gulp-load-plugins')()

platform = process.platform
platform = if /^win/.test(platform) then 'win32' else if /^darwin/.test(platform) then 'osx64' else 'linux' + (if process.arch == 'ia32' then '32' else '64')

# Run node-webkit-builder for the given platforms
build = (platforms) ->
  gulp.src 'src/**'
    .pipe $.nodeWebkitBuilder
      platforms: platforms
      macIcns: if 'osx64' in platforms then './assets/icon.icns' else undefined
      winIco: if 'win32' in platforms then './assets/icon.ico' else undefined
      macZip: if 'osx64' in platforms then true else undefined

# Move dependencies required by the app
gulp.task 'vendor', ->
  gulp.src [
    'node_modules/semver/semver.js'
  ]
    .pipe $.uglify()
    .pipe gulp.dest 'src/vendor/'

# Build for win32; on OSX/Linux, you need Wine installed in order to change the icon of the .exe (or disable winIco above)
gulp.task 'build-win32', ['vendor'], -> build ['win32']

# Build for osx64
gulp.task 'build-osx64', ['vendor'], -> build ['osx64']

# Build for linux32
gulp.task 'build-linux32', ['vendor'], -> build ['linux32']

# Build for linux64
gulp.task 'build-linux64', ['vendor'], -> build ['linux64']

# Create a DMG for osx64; only works on OS X due to gulp-appdmg
gulp.task 'release-osx64', ['build-osx64'],  ->
  shelljs.mkdir 'dist'            # appdmg fails if ./dist doesn't exist
  shelljs.rm 'dist/Messenger.dmg' # appdmg fails if the dmg already exists
  
  gulp.src []
    .pipe $.appdmg
      source: 'assets/dmg.json'
      target: 'dist/Messenger.dmg'

# Create a nsis installer for win32; must have `makensis` installed on unix, not sure about windows
gulp.task 'release-win32', ['build-win32'],  ->
  shelljs.exec 'makensis ./assets/installer.nsi'

# Archive the linux32 files
gulp.task 'release-linux32', ['build-linux32'], ->

  gulp.src 'build/Messenger/linux32/**'
    .pipe $.tar 'Messenger_linux32.tar'
    .pipe $.gzip()
    .pipe gulp.dest 'dist'

# Archive the linux64 files
gulp.task 'release-linux64', ['build-linux64'], ->
  gulp.src 'build/Messenger/linux64/**'
    .pipe $.tar 'Messenger_linux64.tar'
    .pipe $.gzip()
    .pipe gulp.dest 'dist'

# Build osx64 and run it
gulp.task 'debug-osx64', ['build-osx64'], ->
  shelljs.exec 'open ./build/Messenger/osx64/Messenger.app'

# Release for all platforms
gulp.task 'release-all', (callback) ->
  runSequence 'release-osx64', 'release-win32', 'release-linux32', 'release-linux64', callback

# Release for the current platform by default
gulp.task 'default', ['release-' + platform]
