cp = require 'child_process'
gulp = require 'gulp'

manifest = require '../src/package.json'

gulp.task 'kill:darwin64', (done) ->
  cp.exec 'pkill -9 ' + manifest.productName, -> done()

gulp.task 'kill:linux32', (done) ->
  cp.exec 'pkill -9 ' + manifest.name, -> done()

gulp.task 'kill:linux64', (done) ->
  cp.exec 'pkill -9 ' + manifest.name, -> done()

gulp.task 'kill:win32', (done) ->
  cp.exec 'taskkill /F /IM ' + manifest.productName + '.exe', -> done()
