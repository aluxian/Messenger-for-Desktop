gulp = require 'gulp'
del = require 'del'

# Remove the build directory
gulp.task 'purge:build', (done) ->
  del './build', done

# Remove the cache directory
gulp.task 'purge:cache', (done) ->
  del './cache', done

# Remove the dist directory
gulp.task 'purge:dist', (done) ->
  del './dist', done

# Remove the build, cache and dist directories
gulp.task 'purge', [
  'purge:build'
  'purge:cache'
  'purge:dist'
]
