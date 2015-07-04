gulp = require 'gulp'
cson = require 'gulp-cson'
less = require 'gulp-less'
babel = require 'gulp-babel'
mustache = require 'gulp-mustache'
manifest = require '../src/package.json'

# Compile source menus
gulp.task 'compile:menus', ->
  gulp.src './src/menus/**/*.cson'
    .pipe mustache manifest
    .pipe cson()
    .pipe gulp.dest './build/src/menus'

# Compile source styles
gulp.task 'compile:styles', ->
  gulp.src './src/styles/**/*.less'
    .pipe less()
    .pipe gulp.dest './build/src/styles'

# Compile source scripts
gulp.task 'compile:scripts', ->
  gulp.src './src/scripts/**/*.js'
    .pipe babel()
    .pipe gulp.dest './build/src/scripts'

# Move the rest of the files
gulp.task 'compile:assets', ->
  gulp.src [
    './src/index.html'
    './src/package.json'
    './src/node_modules/**/*'
  ], {
    base: './src'
  }
    .pipe gulp.dest './build/src'

# Compile/move everything
gulp.task 'compile', [
  'compile:menus'
  'compile:styles'
  'compile:scripts'
  'compile:assets'
]
