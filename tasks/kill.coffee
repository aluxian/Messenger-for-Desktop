cp = require 'child_process'
gulp = require 'gulp'

manifest = require '../src/package.json'
killed = false

gulp.task 'kill:darwin64', (done) ->
  return done() if killed
  cp.exec 'pkill -9 ' + manifest.productName, -> done()
  killed = true

gulp.task 'kill:linux32', (done) ->
  return done() if killed
  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true

gulp.task 'kill:linux64', (done) ->
  return done() if killed
  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true

gulp.task 'kill:win32', (done) ->
  return done() if killed
  cp.exec 'taskkill /F /IM ' + manifest.productName + '.exe', -> done()
  killed = true
