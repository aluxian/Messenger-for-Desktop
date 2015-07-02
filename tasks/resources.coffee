gulp = require 'gulp'

# Move and process the resources for darwin64
gulp.task 'resources:darwin', ->

# Move and process the resources for linux32 and linux64
gulp.task 'resources:linux', ->

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
