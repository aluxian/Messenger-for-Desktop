gulp = require 'gulp'
githubRelease = require 'gulp-github-release'

manifest = require '../src/package.json'
secrets = require '../secrets.json'

# Upload every file in ./dist to GitHub
gulp.task 'publish:github', ['pack'], ->
  gulp.src './dist/*'
    .pipe githubRelease
      token: secrets.githubToken
      manifest: manifest
      draft: true

# TODO: Upload to PPA
