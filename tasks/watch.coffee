gulp = require 'gulp'
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
    # Launch the app
    console.log 'initial spawn' if args.verbose
    applySpawn(runnablePath, ['--debug'], {stdio: 'inherit'})()

    # Watch files
    gulp.watch './src/styles/**/*', ['compile:' + dist + ':styles']
    gulp.watch './src/themes/**/*', ['compile:' + dist + ':themes']
    gulp.watch './src/images/**/*', ['restart:compile:' + dist + ':images']
    gulp.watch './src/.loggerignore', ['restart:compile:' + dist + ':scripts']
    gulp.watch './src/scripts/browser/**/*', ['restart:compile:' + dist + ':scripts']
    gulp.watch './src/scripts/common/**/*', ['restart:compile:' + dist + ':scripts']
    gulp.watch './src/scripts/renderer/**/*', ['compile:' + dist + ':scripts']
    gulp.watch './src/html/**/*', ['compile:' + dist + ':html']
    gulp.watch './src/package.json', ['restart:compile:' + dist + ':package']

# Watch for the current platform by default
gulp.task 'watch', ['watch:' + platform()]
