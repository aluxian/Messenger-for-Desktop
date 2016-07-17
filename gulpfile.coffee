gulp = require 'gulp'
shelljs = require 'shelljs'
mergeStream = require 'merge-stream'
runSequence = require 'run-sequence'
manifest = require './package.json'
NwBuilder = require 'nw-builder'
$ = require('gulp-load-plugins')()

# Remove directories used by the tasks
gulp.task 'clean', ->
  shelljs.rm '-rf', './build'
  shelljs.rm '-rf', './dist'

# Build for each platform; on OSX/Linux, you need Wine installed to build win32 (or remove winIco below)
['win32', 'osx64', 'linux32', 'linux64'].forEach (platform) ->
  gulp.task 'build:' + platform, ->
    if process.argv.indexOf('--toolbar') > 0
      shelljs.sed '-i', '"toolbar": false', '"toolbar": true', './src/package.json'

    nw = new NwBuilder(
      files: './src/**'
      platforms: [platform]
      version: '0.14.5'
      winIco: if process.argv.indexOf('--noicon') > 0 then undefined else './assets-windows/icon.ico'
      macIcns: './assets-osx/icon.icns'
      macZip: true
      macPlist:
        NSHumanReadableCopyright: 'aluxian.com'
        CFBundleIdentifier: 'com.aluxian.messengerfordesktop'
    )

    nw.build()

# Only runs on OSX (requires XCode properly configured)
gulp.task 'sign:osx64', ['build:osx64'], ->
  shelljs.exec 'codesign -v -f -s "Alexandru Rosianu Apps" ./build/Messenger/osx64/Messenger.app/Contents/Versions/*/*'
  shelljs.exec 'codesign -v -f -s "Alexandru Rosianu Apps" ./build/Messenger/osx64/Messenger.app'
  shelljs.exec 'codesign -v --display ./build/Messenger/osx64/Messenger.app'
  shelljs.exec 'codesign -v --verify ./build/Messenger/osx64/Messenger.app'

# Create a DMG for osx64; only works on OS X because of appdmg
gulp.task 'pack:osx64', ['sign:osx64'], ->
  shelljs.mkdir '-p', './dist'            # appdmg fails if ./dist doesn't exist
  shelljs.rm '-f', './dist/Messenger_osx64_V150_beta1.dmg' # appdmg fails if the dmg already exists

  shelljs.rm '-r', './build/Messenger/osx64/Messenger.app/Contents/Resources/en.lproj'

  gulp.src []
    .pipe require('gulp-appdmg')
      source: './assets-osx/dmg.json'
      target: './dist/Messenger_osx64_V150_beta1.dmg'

# Create a nsis installer for win32; must have `makensis` installed
gulp.task 'pack:win32', ['build:win32'], ->
   shelljs.mkdir '-p', './dist'            # makensis fails if ./dist doesn't exist
   shelljs.exec 'makensis ./assets-windows/installer.nsi'

# Create packages for linux
[32, 64].forEach (arch) ->
  ['deb', 'rpm'].forEach (target) ->
    gulp.task "pack:linux#{arch}:#{target}", ['build:linux' + arch], ->
      shelljs.rm '-rf', './build/linux'

      move_opt = gulp.src [
        './assets-linux/messengerfordesktop.desktop'
        './assets-linux/after-install.sh'
        './assets-linux/after-remove.sh'
        './build/Messenger/linux' + arch + '/**'
      ]
        .pipe gulp.dest './build/linux/opt/MessengerForDesktop'

      move_png48 = gulp.src './assets-linux/icons/48/messengerfordesktop.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/48x48/apps'

      move_png256 = gulp.src './assets-linux/icons/256/messengerfordesktop.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/256x256/apps'

      move_svg = gulp.src './assets-linux/icons/scalable/messengerfordesktop.png'
        .pipe gulp.dest './build/linux/usr/share/icons/hicolor/scalable/apps'

      mergeStream move_opt, move_png48, move_png256, move_svg
        .on 'end', ->
          shelljs.cd './build/linux'

          port = if arch == 32 then 'i386' else 'x86_64'
          output = "../../dist/Messenger_linux#{arch}_V150_beta1.#{target}"

          shelljs.mkdir '-p', '../../dist' # it fails if the dir doesn't exist
          shelljs.rm '-f', output # it fails if the package already exists

          shelljs.exec "fpm -s dir -t #{target} -a #{port} --rpm-os linux -n messengerfordesktop --after-install ./opt/MessengerForDesktop/after-install.sh --after-remove ./opt/MessengerForDesktop/after-remove.sh --license MIT --category Chat --url \"https://messengerfordesktop.com\" --description \"A simple and beautiful app for Facebook Messenger. Chat without distractions on any OS.\" -m \"Alexandru Rosianu <me@aluxian.com>\" -p #{output} -v #{manifest.version} ."
          shelljs.cd '../..'

# Make packages for all platforms
gulp.task 'pack:all', (callback) ->
  runSequence 'pack:osx64', 'pack:win32', 'pack:linux32:deb', 'pack:linux64:deb', callback

# Build osx64 and run it
gulp.task 'run:osx64', ['build:osx64'], ->
  shelljs.exec 'open ./build/Messenger/osx64/Messenger.app'

# Run osx64 without building
gulp.task 'open:osx64', ->
  shelljs.exec 'open ./build/Messenger/osx64/Messenger.app'

# Upload release to GitHub
gulp.task 'release', ['pack:all'], (callback) ->
  gulp.src './dist/*'
    .pipe $.githubRelease
      draft: true
      manifest: manifest

# Make packages for all platforms by default
gulp.task 'default', ['pack:all']
