gulp = require 'gulp'
del = require 'del'

# Remove the build directory
gulp.task 'purge:build', -> del './build'

# Remove the cache directory
gulp.task 'purge:cache', -> del './cache'

# Remove the dist directory
gulp.task 'purge:dist', -> del './dist'

# Remove the build, cache and dist directories
gulp.task 'purge', [
  'purge:build'
  'purge:cache'
  'purge:dist'
]
