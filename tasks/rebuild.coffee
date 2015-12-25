gulp = require 'gulp'
{platform} = require './utils'
manifest = require '../src/package.json'
rebuild = require 'electron-rebuild'
args = require './args'
path = require 'path'

electronPath = '...'
electronVersion = manifest.electronVersion.substr 1

['darwin64', 'linux32', 'linux64', 'win32'].forEach (dist) ->
  gulp.task 'rebuild:' + dist, ['download:' + dist], ->
    rebuild.shouldRebuildNativeModules electronPath, electronVersion
      .then (shouldBuild) ->
        if args.verbose
          console.log 'should build', shouldBuild
        if shouldBuild
          arch = if '32' in dist then 'ia32' else 'x64'
          modulesPath = path.resolve __dirname, '..', 'src', 'node_modules'
          if args.verbose
            console.log 'installing headers', electronVersion, arch
          rebuild.installNodeHeaders electronVersion, null, null, arch
            .then () ->
              if args.verbose
                console.log 'building', electronVersion, modulesPath
              rebuild.rebuildNativeModules electronVersion, modulesPath
        else
          true

# Rebuild for the current platform by default
gulp.task 'rebuild', ['rebuild:' + platform()]
