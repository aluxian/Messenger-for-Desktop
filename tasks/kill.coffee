{applySpawn, platformOnly} = require './utils'
args = require './args'
gulp = require 'gulp'

manifest = require '../src/package.json'

lock = require './lock'
lock.killTask ||= {skip: {}}

[
  ['darwin64', 'pkill', ['-9', manifest.productName]]
  ['linux32', 'pkill', ['-9', manifest.name]]
  ['linux64', 'pkill', ['-9', manifest.name]]
  ['win32', 'taskkill', ['/F', '/IM', manifest.productName + '.exe']]
].forEach (item) ->
  [dist, killCmd, killArgs] = item

  gulp.task 'kill:' + dist, (done) ->
    if lock.killTask.skip[dist]
      console.log 'kill skipped (lock)' if args.verbose
      done()
    else if process.platform.indexOf(platformOnly()) < 0
      console.log 'kill skipped (platforms don\'t match)' if args.verbose
      done()
    else
      console.log 'killing app' if args.verbose
      lock.killTask.skip[dist] = true
      cb = (err) ->
        if err and (err.code is 'ENOENT' or err.code is 1 or err.code is 128)
          console.error err if args.verbose
          done()
        else
          done err
      applySpawn(killCmd, killArgs)(cb)
