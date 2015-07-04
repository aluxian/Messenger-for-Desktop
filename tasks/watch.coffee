gulp = require 'gulp'
livereload = require 'gulp-livereload'

# Watch files and reload the app on changes
['darwin64', 'linux32', 'linux64', 'win32'].forEach (dist) ->
  gulp.task 'watch:' + dist, ['build:' + dist], ->
    livereload.listen()
    gulp.watch './src/menus/**/*', ['compile:' + dist + ':menus']
    gulp.watch './src/styles/**/*', ['compile:' + dist + ':styles']
    gulp.watch './src/scripts/**/*', ['compile:' + dist + ':scripts']
    gulp.watch './src/index.html', ['compile:' + dist + ':html']
    gulp.watch './src/node_modules/**/*', ['compile:' + dist + ':deps']
    gulp.watch './src/package.json', ['compile:' + dist + ':package']
