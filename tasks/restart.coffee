{applySpawn} = require './utils'
args = require './args'
gulp = require 'gulp'

manifest = require '../src/package.json'

[
  [
    'darwin64'
    'pkill'
    ['-9', manifest.productName]
    './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/' + manifest.productName
  ]
  [
    'linux32'
    'pkill'
    ['-9', manifest.name]
    './build/linux32/opt/' + manifest.name + '/' + manifest.name
  ]
  [
    'linux64'
    'pkill'
    ['-9', manifest.name]
    './build/linux64/opt/' + manifest.name + '/' + manifest.name
  ]
  [
    'win32'
    'taskkill'
    ['/F', '/IM', manifest.productName + '.exe']
    './build/win32/' + manifest.productName + '.exe'
  ]
].forEach (item) ->
  [dist, killCmd, killArgs, runnablePath] = item

  # Proxy the compile task then restart the app
  [
    'compile:' + dist + ':scripts'
    'compile:' + dist + ':package'
    'compile:' + dist + ':images'
  ].forEach (proxiedTask) ->
    gulp.task 'restart:' + proxiedTask, [proxiedTask], (done) ->
      cb = (err) ->
        if err and (err.code is 'ENOENT' or err.code is 1 or err.code is 128)
          console.error err if args.verbose
        else if err
          done err
          return

        console.log 're-spawning app' if args.verbose
        applySpawn(runnablePath, ['--debug'], {stdio: 'inherit'})()
        done null
      applySpawn(killCmd, killArgs)(cb)
