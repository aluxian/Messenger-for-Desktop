gulp = require 'gulp'
async = require 'async'
rcedit = require 'rcedit'

cp = require 'child_process'
fs = require 'fs-extra'
path = require 'path'

utils = require './utils'
manifest = require '../src/package.json'

# Build for darwin64
gulp.task 'build:darwin64', ['resources:darwin', 'compile:darwin64', 'clean:build:darwin64'], (done) ->
  async.series [
    # Move the new icon
    (callback) ->
      fromPath = './build/resources/darwin/app.icns'
      toPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/' + manifest.name + '.icns'
      fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath

    # Rename the app executable
    (callback) ->
      exeDir = './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/'
      fromPath = exeDir + 'Electron'
      toPath = exeDir + manifest.productName

      fs.rename fromPath, toPath, utils.log callback, fromPath, '=>', toPath

    # Move the new Info.plist
    (callback) ->
      fromPath = './build/resources/darwin/Info.plist'
      toPath = './build/darwin64/' + manifest.productName + '.app/Contents/Info.plist'
      fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath

    # Touch the .app to refresh it
    (callback) ->
      cmd = 'touch ./build/darwin64/' + manifest.productName + '.app'
      cp.exec cmd, utils.log callback, cmd
  ], done

# Build for linux32 and linux64
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'build:' + dist, ['resources:linux', 'compile:' + dist, 'clean:build:' + dist], (done) ->
    async.series [
      # Rename the executable
      (callback) ->
        exeDir = './build/' + dist + '/opt/' + manifest.name + '/'
        fromPath = exeDir + 'electron'
        toPath = exeDir + manifest.name

        fs.rename fromPath, toPath, utils.log callback, fromPath, '=>', toPath

      # Move the app's .desktop file
      (callback) ->
        fromPath = './build/resources/linux/app.desktop'
        toPath = './build/' + dist + '/usr/share/applications/' + manifest.name + '.desktop'
        fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath

      # Move icons
      async.apply async.waterfall, [
        async.apply fs.readdir, './build/resources/linux/icons'
        (files, callback) ->
          async.map files, (file, callback) ->
            size = path.basename file, '.png'
            fromPath = path.join './build/resources/linux/icons', file
            toPath = './build/' + dist + '/usr/share/icons/hicolor/' + size + 'x' + size + '/apps/' + manifest.name + '.png'
            fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath
          , callback
      ]
    ], done

# Build for win32
gulp.task 'build:win32', ['resources:win', 'compile:win32', 'clean:build:win32'], (done) ->
  async.series [
    # Edit properties of the exe
    (callback) ->
      properties =
        'version-string':
          ProductName: manifest.productName
          CompanyName: manifest.win.companyName
          FileDescription: manifest.description
          LegalCopyright: manifest.win.copyright
          OriginalFilename: manifest.productName + '.exe'
        'file-version': manifest.version
        'product-version': manifest.version
        'icon': './build/resources/win/app.ico'

      rcedit './build/win32/electron.exe', properties, utils.log callback, 'rcedit ./build/win32/electron.exe properties', properties

    # Rename the exe
    (callback) ->
      fromPath = './build/win32/electron.exe'
      toPath = './build/win32/' + manifest.productName + '.exe'
      fs.rename fromPath, toPath, utils.log callback, fromPath, '=>', toPath
  ], done

# Build the app for all platforms
gulp.task 'build', [
  'build:darwin64'
  'build:linux32'
  'build:linux64'
  'build:win32'
]
