gulp = require 'gulp'
async = require 'async'
rcedit = require 'rcedit'

cp = require 'child_process'
fs = require 'fs-extra'
path = require 'path'

manifest = require '../src/package.json'

# Build for darwin64
gulp.task 'build:darwin64', ['resources:darwin', 'src:darwin64', 'clean:build:darwin64'], (done) ->
  async.series [
    # Move the new icon
    (callback) ->
      fromPath = './build/resources/darwin/icon.icns'
      toPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/' + manifest.name + '.icns'
      fs.copy fromPath, toPath, callback

    # Rename the app executable
    (callback) ->
      exeDir = './build/darwin64/' + manifest.productName + '.app/Contents/MacOS/'
      fs.rename exeDir + 'Electron', exeDir + manifest.productName, callback

    # Configure Info.plist
    (callback) ->
      if process.platform isnt 'darwin'
        console.warn 'Skipping Info.plist configuration; disable this check if you have `plutil` installed.'
        return callback()

      plist = './build/darwin64/' + manifest.productName + '.app/Contents/Info.plist'
      args = [
        '-replace CFBundleName -string "' + manifest.productName + '"'
        '-replace CFBundleDisplayName -string "' + manifest.productName + '"'
        '-replace CFBundleExecutable -string "' + manifest.productName + '"'
        '-replace CFBundleIconFile -string ' + manifest.name + '.icns'
        '-replace CFBundleIdentifier -string "' + manifest.darwin.bundleId + '"'
        '-replace CFBundleVersion -string "' + manifest.version + '"'
        '-insert NSHumanReadableCopyright -string "' + manifest.darwin.copyright + '"'
        '-insert LSApplicationCategoryType -string "' + manifest.darwin.appCategoryType + '"'
      ]

      async.each args, (arg, callback) ->
        cp.exec ['plutil', arg, plist].join(' '), callback
      , callback
  ], done

# Build for linux32 and linux64
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'build:' + dist, ['resources:linux', 'src:' + dist, 'clean:build:' + dist], (done) ->
    async.series [
      # Rename the executable
      (callback) ->
        exeDir = './build/' + dist + '/opt/' + manifest.name + '/'
        fs.rename exeDir + 'electron', exeDir + manifest.name, callback

      # Move the app's .desktop file
      (callback) ->
        fromPath = './build/resources/linux/app.desktop'
        toPath = './build/' + dist + '/usr/share/applications/' + manifest.name + '.desktop'
        fs.copy fromPath, toPath, callback

      # Move the app's .desktop file to be used on startup
      (callback) ->
        fromPath = './build/resources/linux/startup.desktop'
        toPath = './build/' + dist + '/opt/' + manifest.name + '/startup.desktop'
        fs.copy fromPath, toPath, callback

      # Move icons
      async.apply async.waterfall, [
        async.apply fs.readdir, './build/resources/linux/icons'
        (files, callback) ->
          async.map files, (file, callback) ->
            size = path.basename file, '.png'
            fromPath = path.join './build/resources/linux/icons', file
            toPath = './build/' + dist + '/usr/share/icons/hicolor/' + size + 'x' + size + '/apps/' + manifest.name + '.png'
            fs.copy fromPath, toPath, callback
          , callback
      ]
    ], done

# Build for win32
gulp.task 'build:win32', ['resources:win', 'src:win32', 'clean:build:win32'], (done) ->
  async.series [
    # Edit properties of the exe
    (callback) ->
      rcedit './build/win32/electron.exe', {
        'version-string':
          ProductName: manifest.productName
          CompanyName: manifest.win.companyName
          FileDescription: manifest.description
          LegalCopyright: manifest.win.copyright
          OriginalFilename: manifest.productName + '.exe'
        'file-version': manifest.version
        'product-version': manifest.version
        'icon': './build/resources/win/app.ico'
      }, callback

    # Rename the exe
    (callback) ->
      fs.rename './build/win32/electron.exe', './build/win32/' + manifest.productName + '.exe', callback
  ], done

# Build the app for all platforms
gulp.task 'build', [
  'build:darwin64'
  'build:linux32'
  'build:linux64'
  'build:win32'
]
