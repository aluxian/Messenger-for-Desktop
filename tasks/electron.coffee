gulp = require 'gulp'
asar = require 'gulp-asar'
electronDownloader = require 'gulp-electron-downloader'

[
  ['darwin', 'x64', 'darwin64']
  ['linux', 'ia32', 'linux32']
  ['linux', 'x64', 'linux64']
  ['win32', 'ia32', 'win32']
].forEach (release) ->
  [platform, arch, name] = release

  gulp.task 'electron:download:' + name, (done) ->
    electronDownloader
      version: 'v0.28.3'
      cacheDir: './cache'
      outputDir: './build'
      platform: platform
      arch: arch
    , done

gulp.task 'electron:download', [
  'electron:download:darwin64'
  'electron:download:linux32'
  'electron:download:linux64'
  'electron:download:win32'
]

['darwin64', 'linux32', 'linux64', 'win32'].forEach (name) ->
  gulp.task 'electron:src:' + name, ['clean:default_app:' + name], ->
    gulp.src './build/src/**/*'
      .pipe asar 'app.asar'
      .pipe gulp.dest './build/' + name + '/resources'

gulp.task 'electron:src', [
  'electron:src:darwin64'
  'electron:src:linux32'
  'electron:src:linux64'
  'electron:src:win32'
]

gulp.task 'electron', [
  'electron:download'
  'electron:src'
]
