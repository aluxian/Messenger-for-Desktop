cp = require 'child_process'
gulp = require 'gulp'
livereload = require 'gulp-livereload'
manifest = require '../src/package.json'

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
    proc = cp.spawn runnablePath
    proc.stdout.pipe process.stdout
    proc.stderr.pipe process.stderr

    gulp.watch './src/menus/**/*', ['compile:' + dist + ':menus']
    gulp.watch './src/styles/**/*', ['compile:' + dist + ':styles']
    gulp.watch './src/scripts/**/*', ['compile:' + dist + ':scripts']
    gulp.watch './src/html/**/*', ['compile:' + dist + ':html']
    gulp.watch './src/node_modules/**/*', ['compile:' + dist + ':deps']
    gulp.watch './src/package.json', ['compile:' + dist + ':package']
