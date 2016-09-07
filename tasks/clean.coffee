fs = require 'fs-extra-promise'
{platform} = require './utils'
gulp = require 'gulp'
del = require 'del'

manifest = require '../src/package.json'

# Remove the default_app folder and the default icon inside the darwin64 build
gulp.task 'clean:build:darwin64', ['download:darwin64'], ->
  del [
    './build/darwin64/' + manifest.productName + '.app/Contents/Resources/default_app.asar'
    './build/darwin64/' + manifest.productName + '.app/Contents/Resources/electron.icns'
  ]
    .then (result) -> console.log result

# Remove the default_app folder inside the linux builds
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'clean:build:' + dist, ['download:' + dist], ->
    del './build/' + dist + '/opt/' + manifest.name + '/resources/default_app.asar'
      .then (result) -> console.log result

# Remove the default_app folder inside the win32 build
gulp.task 'clean:build:win32', ['download:win32'], ->
  del './build/win32/resources/default_app.asar'
    .then (result) -> console.log result

# Clean build dist for the current platform by default
gulp.task 'clean:build', ['clean:build:' + platform()]

# Clean all the dist files for darwin64 and make sure the dir exists
gulp.task 'clean:dist:darwin64', ->
  del './dist/' + manifest.productName + '-' + manifest.version + '-osx.dmg'
    .then (result) -> console.log result
    .then -> fs.ensureDirAsync './dist'

# Just ensure the dir exists (dist files are overwritten)
['linux32', 'linux64', 'win32'].forEach (dist) ->
  gulp.task 'clean:dist:' + dist, ->
    fs.ensureDirAsync './dist'

# Remove packages from previous releases
gulp.task 'clean:prev-releases:win32', ->
  del [
    './dist/' + manifest.name + '-*-setup-for-nsis.exe'
    './dist/' + manifest.name + '-*-full.nupkg'
    '!./dist/' + manifest.name + '-' + manifest.version + '-full.nupkg'
  ]
    .then (result) -> console.log result

# Clean dist for the current platform by default
gulp.task 'clean:dist', ['clean:dist:' + platform()]
