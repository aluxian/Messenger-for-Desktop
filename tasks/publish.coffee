gulp = require 'gulp'
githubRelease = require 'gulp-github-release'
manifest = require '../src/package.json'

# Upload every file in ./dist to GitHub
gulp.task 'publish:github', ['pack'], ->
  gulp.src './dist/*'
    .pipe githubRelease
      token: process.env.GITHUB_TOKEN
      manifest: manifest
      draft: true

# TODO: Upload to PPA
