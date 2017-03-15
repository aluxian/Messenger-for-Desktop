{applySpawn} = require './utils'
{platform} = require './utils'
args = require './args'
gulp = require 'gulp'

manifest = require '../src/package.json'

[
  ['darwin64', './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/' + manifest.productName]
  ['linux32', './build/linux32/opt/' + manifest.name + '/' + manifest.name]
  ['linux64', './build/linux64/opt/' + manifest.name + '/' + manifest.name]
  ['win32', './build/win32/' + manifest.productName + '.exe']
].forEach (item) ->
  [dist, runnablePath] = item

  # Start the app without any building
  gulp.task 'start:' + dist, ->
    console.log 'starting app' if args.verbose
    applySpawn(runnablePath, ['--debug'], {stdio: 'inherit'})()

# Start for the current platform by default
gulp.task 'start', ['start:' + platform()]
