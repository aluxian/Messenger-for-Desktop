beeper = require 'beeper'

gulp = require 'gulp'
plumber = require 'gulp-plumber'
sourcemaps = require 'gulp-sourcemaps'
imagemin = require 'gulp-imagemin'
header = require 'gulp-header'

less = require 'gulp-less'
babel = require 'gulp-babel'
gif = require 'gulp-if'

embedlr = require 'gulp-embedlr'
livereload = require 'gulp-livereload'

manifest = require '../src/package.json'
args = require './args'

[
  ['darwin64', './build/darwin64/' + manifest.productName + '.app/Contents/Resources/app']
  ['linux32', './build/linux32/opt/' + manifest.name + '/resources/app']
  ['linux64', './build/linux64/opt/' + manifest.name + '/resources/app']
  ['win32', './build/win32/resources/app']
].forEach (item) ->
  [dist, dir] = item

  handleError = (err) ->
    console.error err
    beeper()

  # Compile styles
  gulp.task 'compile:' + dist + ':styles', ['clean:build:' + dist], ->
    gulp.src [
      './src/images/**/*.png',
      './src/images/**/*.jpg'
    ]
      .pipe plumber handleError
      .pipe imagemin()
      .pipe plumber.stop()
      .pipe gulp.dest dir + '/images'

  # Compile styles
  gulp.task 'compile:' + dist + ':images', ['clean:build:' + dist], ->
    gulp.src './src/styles/**/*.less'
      .pipe plumber handleError
      .pipe less()
      .pipe plumber.stop()
      .pipe gulp.dest dir + '/styles'
      .pipe livereload()

  # Compile browser scripts
  gulp.task 'compile:' + dist + ':scripts:browser', ['clean:build:' + dist], ->
    gulp.src './src/scripts/browser/**/*.js'
      .pipe plumber handleError
      .pipe gif args.dev, sourcemaps.init()
      .pipe babel
        presets: [
          'es2015'
          'stage-0'
        ]
        plugins: [
          'transform-runtime'
          'default-import-checker'
        ]
      .pipe gif args.dev, sourcemaps.write {sourceRoot: 'src/scripts/browser'}
      .pipe gif args.dev, header "require('source-map-support').install();"
      .pipe header "var log = require('debug')('#{manifest.name}:'" +
        " + require('path').basename(__filename, '.js'));"
      .pipe plumber.stop()
      .pipe gulp.dest dir + '/scripts/browser'

  # Compile renderer scripts
  gulp.task 'compile:' + dist + ':scripts:renderer', ['clean:build:' + dist], ->
    gulp.src './src/scripts/renderer/**/*.js'
      .pipe plumber handleError
      .pipe gif args.dev, sourcemaps.init()
      .pipe babel
        presets: [
          'es2015',
          'stage-0'
        ]
        plugins: [
          'transform-runtime'
          'default-import-checker'
        ]
      .pipe gif args.dev, sourcemaps.write {sourceRoot: 'src/scripts/renderer'}
      .pipe header "var log = require('debug/browser')('#{manifest.name}:'" +
        " + require('path').basename(__filename, '.js'));"
      .pipe plumber.stop()
      .pipe gulp.dest dir + '/scripts/renderer'
      .pipe livereload()

  # Move themes
  gulp.task 'compile:' + dist + ':themes', ['clean:build:' + dist], ->
    gulp.src './src/themes/**/*.css'
      .pipe gulp.dest dir + '/themes'
      .pipe livereload()

  # Move html files
  gulp.task 'compile:' + dist + ':html', ['clean:build:' + dist], ->
    gulp.src './src/html/**/*.html'
      .pipe embedlr
        src: 'http://localhost:35729/livereload.js?snipver=1'
      .pipe gulp.dest dir + '/html'
      .pipe livereload()

  # Move the node modules
  gulp.task 'compile:' + dist + ':deps', ['clean:build:' + dist], ->
    gulp.src './src/node_modules/**/*'
      .pipe gulp.dest dir + '/node_modules'
      .pipe livereload()

  # Move package.json file
  gulp.task 'compile:' + dist + ':package', ['clean:build:' + dist], ->
    gulp.src './src/package.json'
      .pipe gulp.dest dir

  # Compile everything
  gulp.task 'compile:' + dist, [
    'compile:' + dist + ':styles'
    'compile:' + dist + ':images'
    'compile:' + dist + ':scripts:browser'
    'compile:' + dist + ':scripts:renderer'
    'compile:' + dist + ':themes'
    'compile:' + dist + ':html'
    'compile:' + dist + ':deps'
    'compile:' + dist + ':package'
  ]

# Compile for all platforms
gulp.task 'compile', [
  'compile:darwin64'
  'compile:linux32'
  'compile:linux64'
  'compile:win32'
]
