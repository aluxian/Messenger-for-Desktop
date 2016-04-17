gulp = require 'gulp'
moment = require 'moment'
fs = require 'fs-extra-promise'

manifest = require '../src/package.json'
changelogJson = require '../CHANGELOG.json'

gulp.task 'changelog:deb', () ->
  fs.outputFileAsync './build/changelogs/deb.txt',
    changelogJson
      .map (release) ->
        log = release.changes
          .map (line) -> ' * ' + line
          .join '\n'

        parsedDate = new Date(release.releasedAt)
        date = moment(parsedDate).format('ddd, DD MMM YYYY HH:mm:ss ZZ')

        return manifest.name + ' (' + release.version + ') ' +
          release.distribution + '; urgency=' + release.urgency +
          '\n\n' + log + '\n\n' +
          ' -- ' + manifest.author + '  ' + date
      .join '\n\n'

gulp.task 'changelog:rpm', () ->
  fs.outputFileAsync './build/changelogs/rpm.txt',
    changelogJson
      .map (release) ->
        log = release.changes
          .map (line) -> '- ' + line
          .join '\n'

        parsedDate = new Date(release.releasedAt)
        date = moment(parsedDate).format('ddd MMM DD YYYY')

        return '* ' + date + ' ' + manifest.author + ' ' + release.version + '\n' + log
      .join '\n\n'

gulp.task 'changelog:md', () ->
  changelog = changelogJson
    .map (release, index) ->
      log = release.changes
        .map (line) -> '- ' + line
        .join '\n'

      parsedDate = new Date(release.releasedAt)
      date = moment(parsedDate).format('YYYY-DD-MM')

      fullChangelog = ''
      if index < changelogJson.length - 1
        fullChangelog = '[Full Changelog](https://github.com/Aluxian/Whatsie/compare/v' +
          changelogJson[index+1].version.split('-')[0] + '...v' + release.version.split('-')[0] + ') &bull; '

      download = '[Download](https://github.com/Aluxian/Whatsie/releases/tag/v' + release.version.split('-')[0] + ')'

      return '## [' + release.version + '](https://github.com/Aluxian/Whatsie/tree/v' +
          release.version.split('-')[0] + ') (' + date + ')\n\n' + fullChangelog + download + '\n\n' + log
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
