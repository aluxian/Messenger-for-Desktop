gulp = require 'gulp'
del = require 'del'

# Remove the build directory
gulp.task 'clean:build', (done) ->
  del './build', done

# Remove the cache directory
gulp.task 'clean:cache', (done) ->
  del './cache', done

# Remove the release directory
gulp.task 'clean:release', (done) ->
  del './release', done

# Remove the build, cache and release directories
gulp.task 'clean', [
  'clean:build'
  'clean:cache'
  'clean:release'
]

# Remove the default app inside Electron
['darwin64', 'linux32', 'linux64', 'win32'].forEach (name) ->
  gulp.task 'clean:default_app:' + name, (done) ->
    del './build/' + name + '/resources/default_app', done
