gulp = require 'gulp'
livereload = require 'gulp-livereload'
manifest = require '../src/package.json'
{platform, applySpawn} = require './utils'
args = require './args'

# Watch files and reload the app on changes
[
  ['darwin64', './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/' + manifest.productName]
  ['linux32', './build/linux32/opt/' + manifest.name + '/' + manifest.name]
  ['linux64', './build/linux64/opt/' + manifest.name + '/' + manifest.name]
  ['win32', './build/win32/' + manifest.productName + '.exe']
].forEach (item) ->
  [dist, runnablePath] = item

  gulp.task 'watch:' + dist, ['build:' + dist], ->
    # Start livereload
    livereload.listen()

    # Launch the app
    console.log 'initial spawn' if args.verbose
    applySpawn(runnablePath, [], {stdio: 'inherit'})()

    # Watch files
    gulp.watch './src/styles/**/*', ['compile:' + dist + ':styles']
    gulp.watch './src/themes/**/*', ['compile:' + dist + ':themes']
    gulp.watch './src/scripts/browser/**/*', ['restart:compile:' + dist + ':scripts:browser']
    gulp.watch './src/scripts/renderer/**/*', ['compile:' + dist + ':scripts:renderer']
    gulp.watch './src/html/**/*', ['compile:' + dist + ':html']

# Watch for the current platform by default
gulp.task 'watch', ['watch:' + platform()]
