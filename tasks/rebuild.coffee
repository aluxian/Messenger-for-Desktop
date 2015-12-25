gulp = require 'gulp'
{platform} = require './utils'
manifest = require '../src/package.json'
rebuild = require 'electron-rebuild'
path = require 'path'

electronPath = '...'
electronVersion = manifest.electronVersion.substr 1

['darwin64', 'linux32', 'linux64', 'win32'].forEach (dist) ->
  gulp.task 'rebuild:' + dist, ['download:' + dist], ->
    rebuild.shouldRebuildNativeModules electronPath, electronVersion
      .then (shouldBuild) ->
        if shouldBuild
          arch = if '32' in dist then 'ia32' else 'x64'
          modulesPath = path.resolve __dirname, '..', 'src', 'node_modules'
          rebuild.installNodeHeaders electronVersion, null, null, arch
            .then () -> rebuild.rebuildNativeModules electronVersion, modulesPath
        else
          true

# Rebuild for the current platform by default
gulp.task 'rebuild', ['rebuild:' + platform()]
