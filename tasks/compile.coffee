gulp = require 'gulp'
cson = require 'gulp-cson'
less = require 'gulp-less'
babel = require 'gulp-babel'
merge = require 'merge-stream'

# Compile source keymaps
gulp.task 'compile:keymaps', ->
  gulp.src './src/keymaps/**/*.cson'
    .pipe cson()
    .pipe gulp.dest './build/src/keymaps'

# Compile source menus
gulp.task 'compile:menus', ->
  gulp.src './src/menus/**/*.cson'
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
  files = gulp.src [
    './src/index.html'
    './src/package.json'
  ]
    .pipe gulp.dest './build/src'

  modules = gulp.src './src/node_modules/**/*'
    .pipe gulp.dest './build/src/node_modules'

  merge files, modules

# Compile/move everything
gulp.task 'compile', [
  'compile:keymaps'
  'compile:menus'
  'compile:styles'
  'compile:scripts'
  'compile:assets'
]
