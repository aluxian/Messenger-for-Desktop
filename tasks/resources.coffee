gulp = require 'gulp'
mustache = require 'gulp-mustache'
imagemin = require 'gulp-imagemin'

merge = require 'merge-stream'
manifest = require '../src/package.json'

# Move and process the resources for darwin64
gulp.task 'resources:darwin', ->
  dmgConfig = gulp.src './resources/darwin/dmg.json'
    .pipe mustache manifest
    .pipe gulp.dest './build/resources/darwin'

  icns = gulp.src './resources/darwin/*.icns'
    .pipe gulp.dest './build/resources/darwin'

  png = gulp.src './resources/darwin/*.png'
    .pipe imagemin()
    .pipe gulp.dest './build/resources/darwin'

  merge dmgConfig, icns, png

# Move and process the resources for linux32 and linux64
gulp.task 'resources:linux', ->
  manifest.linux.name = manifest.name
  manifest.linux.productName = manifest.productName
  manifest.linux.description = manifest.description
  manifest.linux.version = manifest.version

  desktop = gulp.src './resources/linux/*.desktop'
    .pipe mustache manifest.linux
    .pipe gulp.dest './build/resources/linux'

  icons = gulp.src './resources/linux/icons'
    .pipe imagemin()
    .pipe gulp.dest './build/resources/linux'

  merge desktop, icons

# Move the resources for win32
gulp.task 'resources:win', ->
  gulp.src './resources/win/**/*'
    .pipe imagemin()
    .pipe gulp.dest './build/resources/win'

# Move and process all the resources
gulp.task 'resources', [
  'resources:darwin'
  'resources:linux'
  'resources:win'
]
