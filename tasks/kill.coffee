{applySpawn} = require './utils'
gulp = require 'gulp'

manifest = require '../src/package.json'

lock = require './lock'
lock.killTask ||= { skip: {} }

[
  ['darwin64', 'pkill -9 ' + manifest.productName]
  ['linux32', 'pkill -9 ' + manifest.name]
  ['linux64', 'pkill -9 ' + manifest.name]
  ['win32', 'taskkill /F /IM ' + manifest.productName + '.exe']
].forEach (item) ->
  [dist, killCommand] = item

  gulp.task 'kill:' + dist, (done) ->
    if lock.killTask.skip[dist]
      done()
    else
      lock.killTask.skip[dist] = true
      (applySpawn killCommand)(done)
