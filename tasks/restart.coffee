cp = require 'child_process'
gulp = require 'gulp'

manifest = require '../src/package.json'

[
  ['darwin64', 'pkill -9 ' + manifest.productName, './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/' + manifest.productName]
  ['linux32', 'pkill -9 ' + manifest.name, './build/linux32/opt/' + manifest.name + '/' + manifest.name]
  ['linux64', 'pkill -9 ' + manifest.name, './build/linux64/opt/' + manifest.name + '/' + manifest.name]
  ['win32', 'taskkill /F /IM ' + manifest.productName + '.exe', './build/win32/' + manifest.productName + '.exe']
].forEach (item) ->
  [dist, killCommand, runnablePath] = item

  # Proxy the compile task then restart the app
  [
    'compile:' + dist + ':menus',
    'compile:' + dist + ':scripts'
  ].forEach (proxiedTask) ->
    gulp.task 'restart:' + proxiedTask, [proxiedTask], (done) ->
      cp.exec killCommand, ->
        proc = cp.spawn runnablePath
        proc.stdout.pipe process.stdout
        proc.stderr.pipe process.stderr
        done()
