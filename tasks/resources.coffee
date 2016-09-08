gulp = require 'gulp'
filter = require 'gulp-filter'
mustache = require 'gulp-mustache'
manifest = require '../src/package.json'
{platformOnly, deepClone} = require './utils'

manifest = deepClone manifest

# Move and process the resources for darwin64
gulp.task 'resources:darwin', ->
  templateFilter = filter ['**/*.plist', '**/*.json'], {restore: true}

  if manifest.versionChannel is 'stable'
    manifest.versionChannel = ''
  else
    manifest.versionChannel = '-' + manifest.versionChannel

  unless manifest.buildNum
    manifest.buildNum = process.env.TRAVIS_BUILD_NUMBER or 0

  gulp.src './resources/darwin/**/*'
    .pipe templateFilter
    .pipe mustache manifest
    .pipe templateFilter.restore
    .pipe gulp.dest './build/resources/darwin'

# Move and process the resources for linux32 and linux64
gulp.task 'resources:linux', ->
  templateFilter = filter ['**/*.desktop', '**/*.sh'], {restore: true}

  manifest.linux.name = manifest.name
  manifest.linux.productName = manifest.productName
  manifest.linux.description = manifest.description
  manifest.linux.version = manifest.version

  gulp.src './resources/linux/**/*'
    .pipe templateFilter
    .pipe mustache manifest.linux
    .pipe templateFilter.restore
    .pipe gulp.dest './build/resources/linux'

# Move the resources for win32
gulp.task 'resources:win', ->
  templateFilter = filter ['**/installer.nsi'], {restore: true}
  gulp.src './resources/win/**/*'
    .pipe templateFilter
    .pipe mustache manifest
    .pipe templateFilter.restore
    .pipe gulp.dest './build/resources/win'

# Move and process resources for the current platform by default
gulp.task 'resources', ['resources:' + platformOnly()]
