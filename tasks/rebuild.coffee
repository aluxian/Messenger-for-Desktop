gulp = require 'gulp'
{applySpawn} = require './utils'
manifest = require '../src/package.json'
path = require 'path'

[
  ['32', 'ia32']
  ['64', 'x64']
].forEach (item) ->
  [dist, arch] = item

  # Rebuild native node modules
  gulp.task 'rebuild:' + dist, (done) ->
    process.env.npm_config_disturl = 'https://atom.io/download/atom-shell'
    process.env.npm_config_target = manifest.electronVersion
    process.env.npm_config_arch = arch
    process.env.npm_config_runtime = 'electron'
    process.env.HOME = '~/.electron-gyp'
    options =
      cwd: path.resolve 'src'
      env: process.env
    applySpawn('npm', ['rebuild'], options)(done)
