request = require 'request'
path = require 'path'
args = require './args'
fs = require 'fs'

asar = require 'asar'
async = require 'async'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'

{applyPromise, applySpawn, applyIf, updateManifest, platform} = require './utils'
winInstaller = require 'electron-windows-installer'
manifest = require '../src/package.json'
mainManifest = require '../package.json'

# Sign the app and create a dmg for darwin64; only works on OS X because of appdmg and codesign
gulp.task 'pack:darwin64:dmg', ['build:darwin64', 'clean:dist:darwin64'], (done) ->
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
    # Update package.json
    (callback) ->
      jsonPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app/package.json'
      updateManifest jsonPath, (manifest) ->
        manifest.distrib = 'darwin64:dmg'
        manifest.buildNum = process.env.TRAVIS_BUILD_NUMBER
        manifest.airbrake.env = 'production'
      , callback

    # Remove the dev modules
    applyIf args.prod, applySpawn 'npm', ['prune', '--production'],
      cwd: './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Deduplicate dependencies
    applyIf args.prod, applySpawn 'npm', ['dedupe'],
      cwd: './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Compress the source files into an asar archive
    async.apply asar.createPackage,
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app',
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app.asar'

    # Remove leftovers
    applyPromise del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Unlock the keychain
    applySpawn 'security', [
      'unlock-keychain'
      '-p'
      process.env.SIGN_DARWIN_KEYCHAIN_PASSWORD
      process.env.SIGN_DARWIN_KEYCHAIN_NAME
    ]

    # Sign the app package
    applySpawn 'codesign', [
      '--deep'
      '--force'
      '--verbose'
      '--keychain'
      process.env.SIGN_DARWIN_KEYCHAIN_NAME
      '--sign'
      process.env.SIGN_DARWIN_IDENTITY
      './build/darwin64/' + manifest.productName + '.app'
    ]

    # Create the dmg
    (callback) ->
      appdmg
        source: './build/resources/darwin/dmg.json'
        target: './dist/' + manifest.name + '-' + manifest.version + '-osx.dmg'
      .on 'finish', callback
      .on 'error', callback
  ], done

# Sign the app and create a zip for darwin64; only works on OS X because of codesign
gulp.task 'pack:darwin64:zip', ['build:darwin64'], (done) ->
  if process.platform isnt 'darwin'
    console.warn 'Skipping darwin64 packing; This only works on darwin due to the `codesign` command.'
    return done()

  for envName in ['SIGN_DARWIN_KEYCHAIN_PASSWORD', 'SIGN_DARWIN_KEYCHAIN_NAME', 'SIGN_DARWIN_IDENTITY']
    if not process.env[envName]
      console.warn envName + ' env var not set.'
      return done()

  async.series [
    # Update package.json
    (callback) ->
      jsonPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app/package.json'
      updateManifest jsonPath, (manifest) ->
        manifest.distrib = 'darwin64:zip'
        manifest.buildNum = process.env.TRAVIS_BUILD_NUMBER
        manifest.airbrake.env = 'production'
      , callback

    # Remove the dev modules
    applyIf args.prod, applySpawn 'npm', ['prune', '--production'],
      cwd: './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Deduplicate dependencies
    applyIf args.prod, applySpawn 'npm', ['dedupe'],
      cwd: './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Compress the source files into an asar archive
    async.apply asar.createPackage,
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app',
      './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app.asar'

    # Remove leftovers
    applyPromise del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

    # Unlock the keychain
    applySpawn 'security', [
      'unlock-keychain'
      '-p'
      process.env.SIGN_DARWIN_KEYCHAIN_PASSWORD
      process.env.SIGN_DARWIN_KEYCHAIN_NAME
    ]

    # Sign the app package
    applySpawn 'codesign', [
      '--deep'
      '--force'
      '--verbose'
      '--keychain'
      process.env.SIGN_DARWIN_KEYCHAIN_NAME
      '--sign'
      process.env.SIGN_DARWIN_IDENTITY
      './build/darwin64/' + manifest.productName + '.app'
    ]

    # Create the archive
    applySpawn 'ditto', [
      '-c'
      '-k'
      '--sequesterRsrc'
      '--keepParent'
      './build/darwin64/' + manifest.productName + '.app'
      './dist/' + manifest.name + '-' + manifest.version + '-osx.zip'
    ]
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

      depsList = []
      if target == 'deb'
        depsList = [
          'libappindicator1 | libappindicator | libappindicator-gtk3'
          'gconf2'
          'gconf-service'
          'libgtk2.0-0'
          'libudev0 | libudev1'
          'libgcrypt11 | libgcrypt20'
          'libnotify4'
          'libxtst6'
          'libnss3'
          'python'
          'gvfs-bin'
          'xdg-utils'
          'libcap2'
        ]
      else
        depsList = [
          'lsb-core-noarch'
        ]

      debRecommendsList = [
        'lsb-release'
        'libcanberra-gtk3-module'
        'python'
        'git'
      ]

      debSuggestsList = [
        'libgnome-keyring0'
        'gir1.2-gnomekeyring-1.0'
      ]

      expandArgs = (name, values) ->
        expandedArgs = []
        for value in values
          expandedArgs.push name
          expandedArgs.push value
        expandedArgs

      fpmArgs = []
        .concat [
          '-s', 'dir'
          '-t', target
          '--architecture', archName
          '--rpm-os', 'linux'
          '--name', manifest.name
          '--force' # Overwrite existing files
          if args.verbose then '--verbose' else null
          '--after-install', './build/resources/linux/after-install.sh'
          '--after-remove', './build/resources/linux/after-remove.sh'
          '--deb-changelog', './CHANGELOG.deb'
          '--rpm-changelog', './CHANGELOG.rpm'
        ]
        .concat expandArgs '--depends', depsList
        .concat expandArgs '--deb-recommends', debRecommendsList
        .concat expandArgs '--deb-suggests', debSuggestsList
        .concat [
          '--license', manifest.license
          '--category', manifest.linux.section
          '--description', manifest.description
          '--url', manifest.homepage
          '--maintainer', manifest.author
          '--vendor', manifest.linux.vendor
          '--version', manifest.version
          '--iteration', process.env.CIRCLE_BUILD_NUM || '1'
          '--package', './dist/' + manifest.name + '-VERSION-linux-ARCH.' + target
          '-C', './build/linux' + arch
          '.'
        ]
        .filter (a) -> a?

      if args.verbose
        console.log 'fpmArgs =', fpmArgs

      async.series [
        # Update package.json
        (callback) ->
          jsonPath = './build/linux' + arch + '/opt/' + manifest.name + '/resources/app/package.json'
          updateManifest jsonPath, (manifest) ->
            manifest.distrib = 'linux' + arch + ':' + target
            manifest.buildNum = process.env.CIRCLE_BUILD_NUM
            manifest.airbrake.env = 'production'
          , callback

        # Remove the dev modules
        applyIf args.prod, applySpawn 'npm', ['prune', '--production'],
          cwd: './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'

        # Deduplicate dependencies
        applyIf args.prod, applySpawn 'npm', ['dedupe'],
          cwd: './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'

        # Compress the source files into an asar archive
        async.apply asar.createPackage,
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app',
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app.asar'

        # Remove leftovers
        applyPromise del, './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'

        # Create a file with the target name
        async.apply fs.writeFile, './build/linux' + arch + '/opt/' + manifest.name + '/pkgtarget', target

        # Package the app
        applySpawn 'fpm', fpmArgs
      ], done

# Create the win32 installer; only works on Windows
gulp.task 'pack:win32:installer', ['build:win32', 'clean:dist:win32'], (done) ->
  if process.platform isnt 'win32'
    return console.warn 'Skipping win32 installer packing; This only works on Windows due to Squirrel.Windows.'

  for envName in ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD']
    if not process.env[envName]
      return console.warn envName + ' env var not set.'

  async.series [
    # Update package.json
    async.apply updateManifest, './build/win32/resources/app/package.json', (manifest) ->
      manifest.distrib = 'win32:installer'
      manifest.buildNum = process.env.APPVEYOR_BUILD_NUMBER
      manifest.airbrake.env = 'production'

    # Remove the dev modules
    applyIf args.prod, applySpawn 'npm', ['prune', '--production'],
      cwd: './build/win32/resources/app'

    # Deduplicate dependencies
    applyIf args.prod, applySpawn 'npm', ['dedupe'],
      cwd: './build/win32/resources/app'

    # Compress the source files into an asar archive
    async.apply asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'

    # Remove leftovers
    applyPromise del, './build/win32/resources/app'

    # Create the installer
    (callback) ->
      signParams = [
        '/t'
        'http://timestamp.verisign.com/scripts/timstamp.dll'
        '/f'
        process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p'
        process.env.SIGN_WIN_CERTIFICATE_PASSWORD
      ]

      remoteReleasesUrl = manifest.updater.urls.win32.replace /%CHANNEL%/g, 'dev'
      releasesUrl = manifest.updater.urls.win32 + '/RELEASES'

      request {url: releasesUrl}, (err, res, body) ->
        if err || res.statusCode < 200 || res.statusCode >= 400
          console.log 'Creating installer without remote releases url because of',
            'error', err, 'statusCode', res.statusCode, 'body', res.body
          remoteReleasesUrl = undefined

        winInstaller
          appDirectory: './build/win32'
          outputDirectory: './dist'
          loadingGif: './build/resources/win/install-spinner.gif'
          signWithParams: signParams.join ' '
          setupIcon: './build/resources/win/setup.ico'
          iconUrl: mainManifest.icon.url
          remoteReleases: remoteReleasesUrl
          copyright: manifest.win.copyright
          setupExe: manifest.name + '-' + manifest.version + '-win32-setup.exe'
          noMsi: true
          arch: 'ia32'
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
    # Update package.json
    async.apply updateManifest, './build/win32/resources/app/package.json', (manifest) ->
      manifest.portable = true
      manifest.distrib = 'win32:portable'
      manifest.buildNum = process.env.APPVEYOR_BUILD_NUMBER
      manifest.airbrake.env = 'production'

    # Remove the dev modules
    applyIf args.prod, applySpawn 'npm', ['prune', '--production'],
      cwd: './build/win32/resources/app'

    # Deduplicate dependencies
    applyIf args.prod, applySpawn 'npm', ['dedupe'],
      cwd: './build/win32/resources/app'

    # Compress the source files into an asar archive
    async.apply asar.createPackage, './build/win32/resources/app', './build/win32/resources/app.asar'

    # Remove leftovers
    applyPromise del, './build/win32/resources/app'

    # Sign the exe
    (callback) ->
      cmd = process.env.SIGNTOOL_PATH || 'signtool'
      args = [
        'sign'
        '/t'
        'http://timestamp.verisign.com/scripts/timstamp.dll'
        '/f'
        process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p'
        process.env.SIGN_WIN_CERTIFICATE_PASSWORD
        path.win32.resolve './build/win32/' + manifest.productName + '.exe'
      ]
      applySpawn(cmd, args)(callback)

    # Archive the files
    (callback) ->
      gulp.src './build/win32/**/*'
        .pipe zip manifest.name + '-' + manifest.version + '-win32-portable.zip'
        .pipe gulp.dest './dist'
        .on 'end', callback
  ], done

# Pack for the current platform by default
if process.platform == 'win32'
  gulp.task 'pack', ['pack:' + platform() + ':installer']
else
  gulp.task 'pack', ['pack:' + platform()]
