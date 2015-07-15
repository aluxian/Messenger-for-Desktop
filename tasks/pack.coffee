cp = require 'child_process'
path = require 'path'
fs = require 'fs'

asar = require 'asar'
async = require 'async'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'

winInstaller = require 'electron-windows-installer'
manifest = require '../src/package.json'

# Sign the app and create a dmg for darwin64; only works on OS X because of appdmg and codesign
gulp.task 'pack:darwin64', ['build:darwin64', 'clean:dist:darwin64'], (done) ->
  if process.platform isnt 'darwin'
    console.warn 'Skipping darwin64 packing; This only works on darwin due to `appdmg` and the `codesign` command.'
    return done()

  try
    appdmg = require 'appdmg'
  catch ex
    console.warn 'Skipping darwin64 packing; `appdmg` not installed.'
    return done()

  for envName in ['SIGN_DARWIN_KEYCHAIN_PASSWORD', 'SIGN_DARWIN_KEYCHAIN_NAME', 'SIGN_DARWIN_IDENTITY']
    if not process.env[envName]
      console.warn envName + ' env var not set.'
      return done()

  async.series [
    # First, compress the source files into an asar archive
    async.apply asar.createPackage,
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app',
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app.asar'

    # Remove leftovers
    async.apply del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Unlock the keychain
    async.apply cp.exec, [
      'security'
      'unlock-keychain'
      '-p'
      process.env.SIGN_DARWIN_KEYCHAIN_PASSWORD
      process.env.SIGN_DARWIN_KEYCHAIN_NAME
    ].join(' ')

    # Sign the app package
    async.apply cp.exec, [
      'codesign'
      '--deep'
      '--force'
      '--verbose'
      '--sign "' + process.env.SIGN_DARWIN_IDENTITY + '"'
      './build/darwin64/' + manifest.productName + '.app'
    ].join(' ')

    # Create the dmg
    (callback) ->
      appdmg
        source: './build/resources/darwin/dmg.json'
        target: './dist/' + manifest.productName + '.dmg'
      .on 'finish', callback
      .on 'error', callback
  ], done

# Create deb and rpm packages for linux32 and linux64
[32, 64].forEach (arch) ->
  ['deb', 'rpm'].forEach (target) ->
    gulp.task 'pack:linux' + arch + ':' + target, ['build:linux' + arch, 'clean:dist:linux' + arch], (done) ->
      if arch == 32
        archName = 'i386'
      else if target is 'deb'
        archName = 'amd64'
      else
        archName = 'x86_64'

      args = [
        '-s dir'
        '-t ' + target
        '--architecture ' + archName
        '--rpm-os linux'
        '--name ' + manifest.name
        '--force' # Overwrite existing files
        '--after-install ./build/resources/linux/after-install.sh'
        '--after-remove ./build/resources/linux/after-remove.sh'
        '--deb-changelog ./CHANGELOG.md'
        '--rpm-changelog ./CHANGELOG.md'
        '--license ' + manifest.license
        '--category "' + manifest.linux.section + '"'
        '--description "' + manifest.description + '"'
        '--url "' + manifest.homepage + '"'
        '--maintainer "' + manifest.author + '"'
        '--version "' + manifest.version + '"'
        '--package ' + './dist/' + manifest.name + '-VERSION-ARCH.' + target
        '-C ./build/linux' + arch
        '.'
      ]

      async.series [
        # First, compress the source files into an asar archive
        async.apply asar.createPackage,
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app',
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app.asar'

        # Remove leftovers
        async.apply del, './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'

        # Create a file with the target name
        async.apply fs.writeFile, './build/linux' + arch + '/opt/' + manifest.name + '/pkgtarget', target

        # Package the app
        async.apply cp.exec, 'fpm ' + args.join(' ')
      ], done

# Create the win32 installer; only works on Windows
gulp.task 'pack:win32:installer', ['build:win32', 'clean:dist:win32'], (done) ->
  if process.platform isnt 'win32'
    return console.warn 'Skipping win32 installer packing; This only works on Windows due to Squirrel.Windows.'

  for envName in ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD']
    if not process.env[envName]
      return console.warn envName + ' env var not set.'

  async.series [
    # First, compress the source files into an asar archive
    async.apply asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'

    # Remove leftovers
    async.apply del, './build/win32/resources/app'

    # Create the installer
    (callback) ->
      winInstaller
        appDirectory: './build/win32'
        outputDirectory: './dist'
        loadingGif: './build/resources/win/install-spinner.gif'
        certificateFile: process.env.SIGN_WIN_CERTIFICATE_FILE
        certificatePassword: process.env.SIGN_WIN_CERTIFICATE_PASSWORD
        setupIcon: './build/resources/win/setup.ico'
        iconUrl: 'https://raw.githubusercontent.com/Aluxian/electron-superkit/master/resources/win/app.ico'
        remoteReleases: manifest.repository.url
      .then callback, callback
  ], done

# Create the win32 portable zip
gulp.task 'pack:win32:portable', ['build:win32', 'clean:dist:win32'], (done) ->
  if process.platform isnt 'win32'
    console.warn 'Skipping win32 portable packing; This only works on Windows due to signtool.'
    return done()

  for envName in ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD']
    if not process.env[envName]
      console.warn envName + ' env var not set.'
      return done()

  async.series [
    # First, compress the source files into an asar archive
    async.apply asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'

    # Remove leftovers
    async.apply del, './build/win32/resources/app'

    # Sign the exe
    (callback) ->
      cp.exec [
        if process.env.SIGNTOOL_PATH then '"' + process.env.SIGNTOOL_PATH + '"' else 'signtool'
        'sign'
        '/f ' + process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p ' + process.env.SIGN_WIN_CERTIFICATE_PASSWORD
        path.win32.resolve './build/win32/' + manifest.productName + '.exe'
      ].join(' '), callback

    # Archive the files
    (callback) ->
      gulp.src './build/win32/**/*'
        .pipe zip manifest.name + '-win32-portable.zip'
        .pipe gulp.dest './dist'
        .on 'end', callback
  ], done

# Pack for all the platforms
gulp.task 'pack', [
  'pack:darwin64'
  'pack:linux32'
  'pack:linux64'
  'pack:win32:installer'
  'pack:win32:portable'
]
