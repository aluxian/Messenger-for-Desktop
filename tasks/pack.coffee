path = require 'path'
args = require './args'
fs = require 'fs'

asar = require 'asar'
async = require 'async'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'

{applyPromise, applySpawn, applyIf, updateManifest} = require './utils'
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
    # Update package.json
    (cb) ->
      jsonPath = './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app/packge.json'
      updateManifest jsonPath, (manifest) ->
        manifest.distrib = 'darwin64:dmg'
      , cb

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
      '--sign'
      process.env.SIGN_DARWIN_IDENTITY
      './build/darwin64/' + manifest.productName + '.app'
    ]

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

      # Increment iteration number
      iterPath = path.join __dirname, '..', '.iteration'
      iterNum = (parseInt fs.readFileSync(iterPath, 'utf8'), 10) + 1
      fs.writeFileSync iterPath, "#{iterNum}\n", 'utf8'

      fpmArgs = [
        '-s'
        'dir'
        '-t'
        target
        '--architecture'
        archName
        '--rpm-os'
        'linux'
        '--name'
        manifest.name
        '--force' # Overwrite existing files
        '--rpm-sign' # Requires "~/RPM-GPG-KEY-#{manifest.name}"
        '--rpm-auto-add-directories'
        if args.verbose then '--verbose' else null
        '--after-install'
        './build/resources/linux/after-install.sh'
        '--after-remove'
        './build/resources/linux/after-remove.sh'
        '--deb-changelog'
        './CHANGELOG.deb'
        '--rpm-changelog'
        './CHANGELOG.rpm'
        '--depends'
        'libappindicator1'
        '--license'
        manifest.license
        '--category'
        manifest.linux.section
        '--description'
        manifest.description
        '--url'
        manifest.homepage
        '--maintainer'
        manifest.author
        '--vendor'
        'Aluxian Apps'
        '--version'
        manifest.version
        '--iteration'
        "#{iterNum}"
        '--package'
        './dist/' + manifest.name + '-VERSION-ARCH.' + target
        '-C'
        './build/linux' + arch
        '.'
      ].filter (a) -> a?

      async.series [
        # Update package.json
        (cb) ->
          jsonPath = './build/linux' + arch + '/opt/' + manifest.name + '/resources/app/packge.json'
          updateManifest jsonPath, (manifest) ->
            manifest.distrib = 'linux' + arch + ':' + target
          , cb

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
    async.apply updateManifest, './build/win32/resources/app/packge.json', (manifest) ->
      manifest.distrib = 'win32:installer'

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
    # Update package.json
    async.apply updateManifest, './build/win32/resources/app/packge.json', (manifest) ->
      manifest.portable = true
      manifest.distrib = 'win32:portable'

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
        '/f'
        process.env.SIGN_WIN_CERTIFICATE_FILE
        '/p'
        process.env.SIGN_WIN_CERTIFICATE_PASSWORD
        path.win32.resolve './build/win32/' + manifest.productName + '.exe'
      ]
      (applySpawn cmd, args)(callback)

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
