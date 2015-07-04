fs = require 'fs-extra'
gulp = require 'gulp'
del = require 'del'

manifest = require '../src/package.json'

# Remove the default_app folder and the default icon inside the darwin64 build
gulp.task 'clean:build:darwin64', ['download:darwin64'], (done) ->
  del [
    './build/darwin64/' + manifest.productName + '.app/Contents/Resources/default_app'
    './build/darwin64/' + manifest.productName + '.app/Contents/Resources/atom.icns'
  ], done

# Remove the default_app folder inside the linux builds
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'clean:build:' + dist, ['download:' + dist], (done) ->
    del './build/' + dist + '/opt/' + manifest.name + '/resources/default_app', done

# Remove the default_app folder inside the win32 build
gulp.task 'clean:build:win32', ['download:win32'], (done) ->
  del './build/win32/resources/default_app', done

# Clean build for all platforms
gulp.task 'clean:build', [
  'clean:build:darwin64'
  'clean:build:linux32'
  'clean:build:linux64'
  'clean:build:win32'
]

# Clean all the dist files for darwin64 and make sure the dir exists
gulp.task 'clean:dist:darwin64', (done) ->
  del './dist/' + manifest.productName + '.dmg', ->
    fs.ensureDir './dist', done

# Just ensure the dir exists
['linux32', 'linux64', 'win32'].forEach (dist) ->
  gulp.task 'clean:dist:' + dist, (done) ->
    fs.ensureDir './dist', done

# Clean dist for all platforms
gulp.task 'clean:dist', [
  'clean:dist:darwin64'
  'clean:dist:linux32'
  'clean:dist:linux64'
  'clean:dist:win32'
]
