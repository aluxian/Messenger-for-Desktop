cp = require 'child_process'
async = require 'async'
gulp = require 'gulp'

manifest = require '../src/package.json'
secrets = require '../secrets.json'

gulp.task 'sign:darwin64', ['build:darwin64'], (done) ->
  if process.platform isnt 'darwin'
    console.warn 'Skipping darwin app signing; This only works on darwin due to the `codesign` command.'
    return done()

  async.series [
    async.apply cp.exec, [
      'security'
      'unlock-keychain'
      '-p'
      secrets.darwin.keychainPassword
      secrets.darwin.keychainName
    ].join(' ')

    async.apply cp.exec, [
      'codesign'
      '--deep'
      '--force'
      '--verbose'
      '--sign "' + secrets.darwin.signingIdentity + '"'
      './build/darwin64/' + manifest.productName + '.app'
    ].join(' ')
  ], done
