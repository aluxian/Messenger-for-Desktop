gulp = require 'gulp'
asar = require 'gulp-asar'
del = require 'del'

manifest = require '../src/package.json'

# Copy src files inside the darwin64 build as an asar archive
gulp.task 'src:darwin64', ['compile', 'clean:build:darwin64'], ->
  gulp.src './build/src/**/*'
    .pipe asar 'app.asar'
    .pipe gulp.dest './build/darwin64/' + manifest.productName + '.app/Contents/Resources'

# Copy src files inside the linux builds as an asar archive
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'src:' + dist, ['compile', 'clean:build:' + dist], ->
    gulp.src './build/src/**/*'
      .pipe asar 'app.asar'
      .pipe gulp.dest './build/' + dist + '/opt/' + manifest.name + '/resources'

# Copy src files inside the win32 build as an asar archive
gulp.task 'src:win32', ['compile', 'clean:build:win32'], ->
  gulp.src './build/src/**/*'
    .pipe asar 'app.asar'
    .pipe gulp.dest './build/win32/resources'

# Copy for all platforms
gulp.task 'src', [
  'src:darwin64'
  'src:linux32'
  'src:linux64'
  'src:win32'
]
