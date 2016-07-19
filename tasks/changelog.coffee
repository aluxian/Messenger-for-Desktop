gulp = require 'gulp'
moment = require 'moment'
fs = require 'fs-extra-promise'

manifest = require '../src/package.json'
mainManifest = require '../package.json'
changelogJson = require '../CHANGELOG.json'

gulp.task 'changelog:deb', ->
  fs.outputFileAsync './build/changelogs/deb.txt',
    changelogJson
      .map (release) ->
        if Array.isArray release.changes
          log = release.changes
            .map (line) -> '  - ' + line
            .join '\n'
        else
          log = []
          for key in Object.keys(release.changes)
            logs = release.changes[key]
              .map (line) -> '    - ' + line
              .join '\n'
            log.push '  * ' + key
            log.push logs
          log = log.join '\n'

        parsedDate = new Date(release.releasedAt)
        date = moment(parsedDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ')

        return manifest.name + ' (' + release.version + ') ' + release.channel +
          '; urgency=' + release.urgency + '\n\n' + log + '\n\n' +
          '-- ' + manifest.author + '  ' + date
      .join '\n\n'

gulp.task 'changelog:rpm', ->
  fs.outputFileAsync './build/changelogs/rpm.txt',
    changelogJson
      .map (release) ->
        if Array.isArray release.changes
          log = release.changes
            .map (line) -> '- ' + line
            .join '\n'
        else
          log = []
          for key in Object.keys(release.changes)
            logs = release.changes[key]
              .map (line) -> '- ' + key + ': ' + line
              .join '\n'
            log.push logs
          log = log.join '\n'

        parsedDate = new Date(release.releasedAt)
        date = moment(parsedDate).format('ddd MMM DD YYYY')

        channelSuffix = ''
        if release.channel isnt 'stable'
          channelSuffix = '-' + release.channel

        return '* ' + date + ' ' + manifest.author + ' ' + release.version + channelSuffix + '\n' + log
      .join '\n\n'

gulp.task 'changelog:md', ->
  changelog = changelogJson
    .map (release, index) ->
      if Array.isArray release.changes
        log = release.changes
          .map (line) -> '- ' + line
          .join '\n'
      else
        log = []
        for key in Object.keys(release.changes)
          logs = release.changes[key]
            .map (line) -> '- ' + line
            .join '\n'
          log.push '\n**' + key + '**\n'
          log.push logs
        log = log.join '\n'

      parsedDate = new Date(release.releasedAt)
      date = moment(parsedDate).format('YYYY-DD-MM')

      repoUrl = mainManifest.repository.url.replace '.git', ''

      fullChangelog = ''
      if index < changelogJson.length - 1
        fullChangelog = '[Full Changelog](' + repoUrl + '/compare/v' +
          changelogJson[index+1].version + '...v' + release.version + ') &bull; '

      download = '[Download](' + repoUrl + '/releases/tag/v' + release.version + ')'

      channelSuffix = ''
      if release.channel isnt 'stable'
        channelSuffix = '-' + release.channel

      return '## [' + release.version + channelSuffix + '](' + repoUrl + '/tree/v' +
          release.version + ') (' + date + ')\n\n' + fullChangelog + download + '\n' + log
    .join '\n\n'
  changelog += '\n'
  fs.outputFileAsync './CHANGELOG.md', changelog

# Generate only linux changelogs
gulp.task 'changelog:linux', [
  'changelog:deb'
  'changelog:rpm'
]

# Generate all of them by default
gulp.task 'changelog', [
  'changelog:deb'
  'changelog:rpm'
  'changelog:md'
]
