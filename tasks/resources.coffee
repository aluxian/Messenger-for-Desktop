gulp = require 'gulp'
filter = require 'gulp-filter'
mustache = require 'gulp-mustache'
manifest = require '../src/package.json'

# Move and process the resources for darwin64
gulp.task 'resources:darwin', ->
  templateFilter = filter ['*.plist', '*.json']

  gulp.src './resources/darwin/**/*'
    .pipe templateFilter
    .pipe mustache manifest
    .pipe templateFilter.restore()
    .pipe gulp.dest './build/resources/darwin'

# Move and process the resources for linux32 and linux64
gulp.task 'resources:linux', ->
  templateFilter = filter ['*.desktop', '*.sh']

  manifest.linux.name = manifest.name
  manifest.linux.productName = manifest.productName
  manifest.linux.description = manifest.description
  manifest.linux.version = manifest.version

  gulp.src './resources/linux/**/*'
    .pipe templateFilter
    .pipe mustache manifest.linux
    .pipe templateFilter.restore()
    .pipe gulp.dest './build/resources/linux'

# Move the resources for win32
gulp.task 'resources:win', ->
  gulp.src './resources/win/**/*'
    .pipe gulp.dest './build/resources/win'

# Move and process all the resources
gulp.task 'resources', [
  'resources:darwin'
  'resources:linux'
  'resources:win'
]
