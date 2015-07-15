cp = require 'child_process'
gulp = require 'gulp'

manifest = require '../src/package.json'
killed = false

gulp.task 'kill:darwin64', (done) ->
  # Skip if already killed and is a watch task
  if killed and 'watch:' in process.argv
    return done()

  cp.exec 'pkill -9 ' + manifest.productName, -> done()
  killed = true

gulp.task 'kill:linux32', (done) ->
  # Skip if already killed and is a watch task
  if killed and 'watch:' in process.argv
    return done()

  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true

gulp.task 'kill:linux64', (done) ->
  # Skip if already killed and is a watch task
  if killed and 'watch:' in process.argv
    return done()

  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true

gulp.task 'kill:win32', (done) ->
  # Skip if already killed and is a watch task
  if killed and 'watch:' in process.argv
    return done()

  cp.exec 'taskkill /F /IM ' + manifest.productName + '.exe', -> done()
  killed = true
