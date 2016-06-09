gulp = require 'gulp'
path = require 'path'
fs = require 'fs'

async = require 'async'
githubRelease = require 'gulp-github-release'
request = require 'request'

manifest = require '../src/package.json'
mainManifest = require '../package.json'
changelogJson = require '../CHANGELOG.json'
args = require './args'

# Upload every file in ./dist to GitHub
gulp.task 'publish:github', ->
  if not process.env.GITHUB_TOKEN
    return console.warn 'GITHUB_TOKEN env var not set.'

  channelAppend = ''
  if manifest.versionChannel != 'stable'
    channelAppend = '-' + manifest.versionChannel

  release = changelogJson[0]
  log = []
  for key in Object.keys(release.changes)
    logs = release.changes[key]
      .map (line) -> '- ' + line
      .join '\n'
    log.push '\n**' + key + '**\n'
    log.push logs
  changelog = log.join '\n'

  gulp.src './dist/*'
    .pipe githubRelease
      token: process.env.GITHUB_TOKEN
      manifest: manifest
      reuseRelease: true
      reuseDraftOnly: true
      draft: true
      tag: 'v' + manifest.version
      name: 'v' + manifest.version + channelAppend
      notes: changelog.trim()

# Upload deb and RPM packages to Bintray
['deb', 'rpm'].forEach (dist) ->
  gulp.task 'publish:bintray:' + dist, (done) ->
    if not process.env.BINTRAY_API_KEY
      return console.warn 'BINTRAY_API_KEY env var not set.'

    arch64Name = if dist == 'deb' then 'amd64' else 'x86_64'
    tasks = [
      ['./dist/' + manifest.name + '-' + manifest.version + '-linux-' + arch64Name + '.' + dist, arch64Name]
      ['./dist/' + manifest.name + '-' + manifest.version + '-linux-i386.' + dist, 'i386']
    ].map (item) ->
      [srcPath, archType] = item

      host = 'https://api.bintray.com'
      subject = mainManifest.bintray.subject
      filePath = path.basename(srcPath)

      if dist == 'deb'
        poolPath = 'pool/main/' + manifest.name[0] + '/'
        filePath = poolPath + manifest.name + '/' + filePath

      opts =
        url: host + '/content/' + subject + '/' + dist + '/' + filePath
        auth:
          user: subject
          pass: process.env.BINTRAY_API_KEY
        headers:
          'X-Bintray-Package': manifest.name
          'X-Bintray-Version': manifest.version
          'X-Bintray-Publish': 1
          'X-Bintray-Override': 1
          'X-Bintray-Debian-Distribution': manifest.versionChannel
          'X-Bintray-Debian-Component': 'main'
          'X-Bintray-Debian-Architecture': archType

      (cb) ->
        console.log 'Uploading', srcPath if args.verbose
        fs.createReadStream srcPath
          .pipe request.put opts, (err, res, body) ->
            if not err
              console.log body if args.verbose
            cb(err)

    async.series tasks, done

# Upload artifacts to Bintray
['darwin', 'win32', 'linux'].forEach (dist) ->
  gulp.task 'publish:bintray:artifacts:' + dist, (done) ->
    if not process.env.BINTRAY_API_KEY
      return console.warn 'BINTRAY_API_KEY env var not set.'

    fs.readdir './dist', (err, files) ->
      if err
        return done err

      tasks = files.map (fileNameShort) ->
        fileNameLong = path.resolve './dist/', fileNameShort

        host = 'https://api.bintray.com'
        subject = mainManifest.bintray.subject

        opts =
          url: host + '/content/' + subject + '/artifacts/staging/' + dist + '/' + fileNameShort
          auth:
            user: subject
            pass: process.env.BINTRAY_API_KEY
          headers:
            'X-Bintray-Package': manifest.name
            'X-Bintray-Version': manifest.version
            'X-Bintray-Publish': 1
            'X-Bintray-Override': 1

        (cb) ->
          console.log 'Uploading', fileNameLong if args.verbose
          fs.createReadStream fileNameLong
            .pipe request.put opts, (err, res, body) ->
              if not err
                console.log body if args.verbose
              cb(err)

      async.series tasks, done
