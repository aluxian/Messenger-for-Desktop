winInstaller = require 'electron-windows-installer'
appdmg = require 'appdmg'
cp = require 'child_process'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'
asar = require 'gulp-asar'

manifest = require '../src/package.json'
secrets = require '../secrets.json'

# Create a dmg for darwin64; only works on OS X because of appdmg
gulp.task 'pack:darwin64', ['sign:darwin64', 'clean:dist:darwin64'], (done) ->
  if process.platform isnt 'darwin'
    console.warn 'Skipping darwin64 packing; This only works on darwin due to `appdmg`.'
    return done()

  async.series [
    # First, compress the source files into an asar archive
    (callback) ->
      gulp.src './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app/**/*'
        .pipe asar 'app.asar'
        .pipe gulp.dest './build/darwin64/' + manifest.productName + '.app/Contents/Resources'
        .on 'end', callback

    # Remove leftovers
    async.apply del, './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app'

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
      args = [
        '-s dir'
        '-t ' + target
        '--architecture ' + if arch == 32 then 'i386' else 'amd64'
        '--name ' + manifest.name
        '--force' # Overwrite existing packages
        '--after-install ./build/resources/linux/after-install.sh'
        '--after-remove ./build/resources/linux/after-remove.sh'
        '--deb-changelog ./CHANGELOG.md'
        '--rpm-changelog ./CHANGELOG.md'
        '--license ' + manifest.license
        '--category "' + manifest.linux.section + '"'
        '--description "' + manifest.description + '"'
        '--url "' + manifest.homepage + '"'
        '--maintainer "' + manifest.author + '"'
        '--vendor "' + manifest.linux.vendor + '"'
        '--version "' + manifest.version + '"'
        '--package ' + './dist/' + manifest.name + '-linux' + arch + '.' + target
        '-C ./build/linux' + arch
        '.'
      ]

      cp.exec 'fpm ' + args.join(' '), done

# Create the win32 installer; only works on Windows
gulp.task 'pack:win32:installer', ['build:win32', 'clean:dist:win32'], ->
  if process.platform isnt 'win32'
    return console.warn 'Skipping win32 packing; This only works on Windows due to Squirrel.Windows.'

  winInstaller
    appDirectory: './build/win32'
    outputDirectory: './dist'
    loadingGif: './build/resources/win/install-spinner.gif'
    certificateFile: secrets.win.certificateFile,
    certificatePassword: secrets.win.certificatePassword
    setupIcon: './build/resources/win/setup.ico'
    iconUrl: 'https://raw.githubusercontent.com/Aluxian/electron-starter/master/resources/win/app.ico'
    remoteReleases: manifest.repository.url

# Create the win32 portable zip
gulp.task 'pack:win32:portable', ['build:win32', 'clean:dist:win32'], (done) ->
  gulp.src './build/win32'
    .pipe zip manifest.name + '-win32-portable.zip'
    .pipe gulp.dest './dist'

# Pack for all the platforms
gulp.task 'pack', [
  'pack:darwin64'
  'pack:linux32'
  'pack:linux64'
  'pack:win32:installer'
  'pack:win32:portable'
]
