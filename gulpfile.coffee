gulp = require 'gulp'
shelljs = require 'shelljs'
runSequence = require 'run-sequence'
manifest = require './package.json'
$ = require('gulp-load-plugins')()

# Remove the ./build and ./dist directories
gulp.task 'clean', ->
  shelljs.rm '-rf', './build'
  shelljs.rm '-rf', './dist'

# Move app dependencies into ./src/vendor
gulp.task 'vendor', ->
  gulp.src [
    './node_modules/semver/semver.js'
  ]
    .pipe $.uglify()
    .pipe gulp.dest './src/vendor/'

# Build for each platform; on OSX/Linux, you need Wine installed to build win32 (or remove winIco below)
['win32', 'osx64', 'linux32', 'linux64'].forEach (platform) ->
  gulp.task 'build:' + platform, ['vendor'], ->
    gulp.src './src/**'
      .pipe $.nodeWebkitBuilder
        platforms: [platform]
        winIco: './assets/icon.ico'
        macIcns: './assets/icon.icns'
        macZip: true
        macPlist:
          NSHumanReadableCopyright: 'Copyright © 2015 aluxian.com'
          CFBundleIdentifier: 'com.aluxian.messengerfordesktop'

# Create a DMG for osx64; only works on OS X because of appdmg
gulp.task 'pack:osx64', ['build:osx64'], ->
  shelljs.mkdir '-p', './dist'            # appdmg fails if ./dist doesn't exist
  shelljs.rm '-f', './dist/Messenger.dmg' # appdmg fails if the dmg already exists

  gulp.src []
    .pipe $.appdmg
      source: './assets-osx/dmg.json'
      target: './dist/Messenger.dmg'

# Create a nsis installer for win32; must have `makensis` installed
gulp.task 'pack:win32', ['build:win32'], ->
   shelljs.exec 'makensis ./assets-windows/installer.nsi'

# Create packages for linux
[32, 64].forEach (arch) ->
  gulp.task 'pack:linux' + arch, ['build:linux' + arch], ->
    gulp.src [
      './assets-linux/icon_256.png'
      './assets-linux/messengerfordesktop.desktop'
    ]
      .pipe gulp.dest './build/Messenger/linux' + arch
      .on 'end', ->
        ['deb', 'rpm'].forEach (target) ->
          port = if arch == 32 then 'i386' else 'amd64'
          name = manifest.name.toLowerCase()
          version = manifest.version
          url = 'https://messengerfordesktop.com'
          description = 'Beautiful desktop client for Facebook Messenger. Chat without being distracted by your feed or notifications.'
          afterInstall = './assets-linux/after-install.sh'
          afterRemove = './assets-linux/after-remove.sh'
          maintainer = 'Alexandru Rosianu <me@aluxian.com>'
          output = "./dist/Messenger_linux#{arch}.#{target}"

          p1 = "-s dir -t #{target} -a #{port} -n #{name} --after-install #{afterInstall} --after-remove #{afterRemove}"
          p2 = "--category Chat --url \"#{url}\" --description \"#{description}\" -m \"#{maintainer}\" -p #{output} -v #{version}"

          shelljs.rm '-f', output # it fails if the package already exists
          shelljs.exec "fpm #{p1} #{p2} ./build/Messenger/linux#{arch}/"

# Make packages for all platforms
gulp.task 'pack:all', (callback) ->
  runSequence 'pack:osx64', 'pack:win32', 'pack:linux32', 'pack:linux64', callback

# Build osx64 and run it
gulp.task 'run:osx64', ['build:osx64'], ->
  shelljs.exec 'open ./build/Messenger/osx64/Messenger.app'

# Upload release to GitHub
gulp.task 'release', (callback) ->
  gulp.src './dist/*'
    .pipe $.githubRelease
      draft: true
      manifest: manifest

# Make packages for all platforms by default
gulp.task 'default', ['pack:all']
