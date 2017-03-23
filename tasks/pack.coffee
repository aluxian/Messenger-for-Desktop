request = require 'request'
path = require 'path'
rcedit = require 'rcedit'
args = require './args'

asar = require 'asar'
async = require 'async'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'
tar = require 'gulp-tar'
gzip = require 'gulp-gzip'

utils = require './utils'
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
        manifest.portable = false
        manifest.distrib = 'darwin64:dmg'
        manifest.buildNum = process.env.TRAVIS_BUILD_NUMBER
        manifest.dev = false
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
        manifest.portable = false
        manifest.distrib = 'darwin64:zip'
        manifest.buildNum = process.env.TRAVIS_BUILD_NUMBER
        manifest.dev = false
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
      if arch is 32
        archName = 'i386'
      else if target is 'deb'
        archName = 'amd64'
      else
        archName = 'x86_64'

      depsList = []
      if target is 'deb'
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
          # 'lsb-core-noarch'
          # 'libappindicator'
          # 'libappindicator1'
          # 'libappindicator-gtk3'
        ]

      debRecommendsList = [
        'lsb-release'
        'libcanberra-gtk3-module'
        'hunspell'
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
          '--deb-changelog', './build/changelogs/deb.txt'
          '--rpm-changelog', './build/changelogs/rpm.txt'
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
          '--vendor', manifest.authorName
          '--version', manifest.version
          '--iteration', process.env.CIRCLE_BUILD_NUM or '1'
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
            manifest.portable = false
            manifest.distrib = 'linux' + arch + ':' + target
            manifest.buildNum = process.env.CIRCLE_BUILD_NUM
            manifest.dev = false
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

        # Package the app
        applySpawn 'fpm', fpmArgs
      ], done

# Create tar packages for linux32 and linux64
[32, 64].forEach (arch) ->
  gulp.task 'pack:linux' + arch + ':tar', ['build:linux' + arch, 'clean:dist:linux' + arch], (done) ->
    async.series [
      # Update package.json
      (callback) ->
        jsonPath = './build/linux' + arch + '/opt/' + manifest.name + '/resources/app/package.json'
        updateManifest jsonPath, (manifest) ->
          manifest.portable = true
          manifest.distrib = 'linux' + arch + ':tar'
          manifest.buildNum = process.env.CIRCLE_BUILD_NUM
          manifest.dev = false
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

      # Archive the files
      (callback) ->
        gulp.src './build/linux' + arch + '/opt/' + manifest.name + '/**/*'
          .pipe tar(manifest.name + '-' + manifest.version + '-linux' + arch + '.tar')
          .pipe gzip()
          .pipe gulp.dest './dist'
          .on 'end', callback
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
      manifest.portable = false
      manifest.distrib = 'win32:installer'
      manifest.buildNum = process.env.APPVEYOR_BUILD_NUMBER
      manifest.dev = false

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

      remoteReleasesUrl = manifest.updater.urls.win32
        .replace /{{& SQUIRREL_UPDATES_URL }}/g, process.env.SQUIRREL_UPDATES_URL
        .replace /%CHANNEL%/g, 'dev'
      releasesUrl = remoteReleasesUrl + '/RELEASES'

      request {url: releasesUrl}, (err, res, body) ->
        if err or not res or res.statusCode < 200 or res.statusCode >= 400
          console.log 'Creating installer without remote releases url', releasesUrl, 'because of',
            'error', err, 'statusCode', res and res.statusCode, 'body', res and res.body
          remoteReleasesUrl = undefined

        winInstaller
          appDirectory: './build/win32'
          outputDirectory: './dist'
          loadingGif: './build/resources/win/install-spinner.gif'
          signWithParams: signParams.join ' '
          setupIcon: './build/resources/win/setup.ico'
          iconUrl: mainManifest.icon.url
          description: manifest.productName
          authors: manifest.authorName
          remoteReleases: remoteReleasesUrl
          copyright: manifest.copyright
          setupExe: manifest.name + '-' + manifest.version + '-win32-setup.exe'
          noMsi: true
          arch: 'ia32'
        .then callback, callback
  ], done

# Create the win32 nsis installer
gulp.task 'pack:win32:nsis', ['build:win32', 'clean:dist:win32'], (done) ->
  if process.platform isnt 'win32'
    return console.warn 'Skipping win32 NSIS installer packing; This has only been tested on Windows.'

  for envName in ['SIGN_WIN_CERTIFICATE_FILE', 'SIGN_WIN_CERTIFICATE_PASSWORD']
    if not process.env[envName]
      return console.warn envName + ' env var not set.'

  async.series [
    # Update package.json
    async.apply updateManifest, './build/win32/resources/app/package.json', (manifest) ->
      manifest.portable = false
      manifest.distrib = 'win32:nsis'
      manifest.buildNum = process.env.APPVEYOR_BUILD_NUMBER
      manifest.dev = false

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
      console.log 'creating installer'
      signParams = [
        '/t'
        'http://timestamp.verisign.com/scripts/timstamp.dll'
        '/f'
        process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p'
        process.env.SIGN_WIN_CERTIFICATE_PASSWORD
      ]

      remoteReleasesUrl = manifest.updater.urls.win32
        .replace /{{& SQUIRREL_UPDATES_URL }}/g, process.env.SQUIRREL_UPDATES_URL
        .replace /%CHANNEL%/g, 'dev'
      releasesUrl = remoteReleasesUrl + '/RELEASES'

      console.log 'creating check request'
      request {url: releasesUrl}, (err, res, body) ->
        console.log 'request done'

        if err or not res or res.statusCode < 200 or res.statusCode >= 400
          console.log 'Creating installer without remote releases url', releasesUrl, 'because of',
            'error', err, 'statusCode', res and res.statusCode, 'body', res and res.body
          remoteReleasesUrl = undefined

        console.log 'request ok, running winInstaller'
        winInstaller
          appDirectory: './build/win32'
          outputDirectory: './dist'
          loadingGif: './build/resources/win/install-spinner.gif'
          signWithParams: signParams.join ' '
          setupIcon: './build/resources/win/setup.ico'
          iconUrl: mainManifest.icon.url
          description: manifest.productName
          authors: manifest.authorName
          remoteReleases: remoteReleasesUrl
          copyright: manifest.copyright
          setupExe: manifest.name + '-' + manifest.version + '-win32-setup-for-nsis.exe'
          noMsi: true
          arch: 'ia32'
        .then ->
          console.log 'winInstaller done'
          callback()
        .catch (err) ->
          console.log 'winInstaller errored'
          callback err

    # Run makensis
    applySpawn (process.env.MAKENSIS_PATH or 'makensis.exe'), ['build/resources/win/installer.nsi']

    # Edit properties of the exe
    (callback) ->
      properties =
        'version-string':
          ProductName: manifest.name
          CompanyName: manifest.name
          FileDescription: manifest.name
          LegalCopyright: manifest.name
        'file-version': manifest.version
        'product-version': manifest.version

      exePath = './dist/' + manifest.name + '-' + manifest.version + '-win32-nsis.exe'
      logMessage = 'rcedit ' + exePath + ' properties'
      fakeCallback = (err) ->
        if err
          console.log 'rcedit failed'
          console.error err
        callback()
      rcedit exePath, properties, utils.log fakeCallback, logMessage, JSON.stringify(properties)

    # Sign the exe
    (callback) ->
      cmd = process.env.SIGNTOOL_PATH or 'signtool'
      args = [
        'sign'
        '/t'
        'http://timestamp.verisign.com/scripts/timstamp.dll'
        '/f'
        process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p'
        process.env.SIGN_WIN_CERTIFICATE_PASSWORD
        path.win32.resolve './dist/' + manifest.name + '-' + manifest.version + '-win32-nsis.exe'
      ]
      applySpawn(cmd, args)(callback)
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
      manifest.dev = false

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
      cmd = process.env.SIGNTOOL_PATH or 'signtool'
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
