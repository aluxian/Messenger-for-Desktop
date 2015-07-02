gulp = require 'gulp'
zip = require 'gulp-zip'

winInstaller = require 'electron-windows-installer'

manifest = require '../src/package.json'
secrets = require '../secrets.json'

# Create the win32 installer
gulp.task 'pack:win32:installer', ['build:win32', 'sign:win32'], (done) ->
  winInstaller
    appDirectory: './build/win32'
    outputDirectory: './dist'
    loadingGif: './build/resources/win/install-spinner.gif'
    certificateFile: secrets.win.certificateFile
    certificatePassword: secrets.win.certificatePassword
    setupIcon: './build/resources/win/setup.ico'
    iconUrl: 'https://raw.githubusercontent.com/Aluxian/electron-starter/master/resources/win/app.ico'
    remoteReleases: manifest.repository.url
  .then done, done

# Create the win32 portable zip
gulp.task 'pack:win32:portable', ['build:win32', 'sign:win32'], (done) ->
  gulp.src './build/win32'
    .pipe zip manifest.name + '-win-portable.zip'
    .pipe gulp.dest './dist'

# Pack for all the platforms
gulp.task 'pack', [
  'pack:darwin64'
  'pack:linux32'
  'pack:linux64'
  'pack:win32:installer'
  'pack:win32:portable'
]
