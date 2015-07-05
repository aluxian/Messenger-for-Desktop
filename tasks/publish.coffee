gulp = require 'gulp'
githubRelease = require 'gulp-github-release'
manifest = require '../src/package.json'

# Upload every file in ./dist to GitHub
gulp.task 'publish:github', ['pack'], ->
  if not process.env.GITHUB_TOKEN
    return console.warn 'GITHUB_TOKEN env var not set.'

  gulp.src './dist/*'
    .pipe githubRelease
      token: process.env.GITHUB_TOKEN
      manifest: manifest
      draft: true

# TODO: Upload to PPA
