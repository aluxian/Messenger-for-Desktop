import AutoUpdater from '../components/auto-updater';
import EventEmitter from 'events';

class AutoUpdateManager extends EventEmitter {

  constructor() {
    super();
    AutoUpdater.enabled
  }

}

export default AutoUpdateManager;
  //
  //
  // constructor: (@version, @testMode, @disabled) ->
  //   @state = IdleState
  //   @iconPath = path.resolve(__dirname, '..', '..', 'resources', 'atom.png')
  //   @feedUrl = "https://atom.io/api/updates?version=#{@version}"
  //   process.nextTick => @setupAutoUpdater()
  //
  // setupAutoUpdater: ->
  //   if process.platform is 'win32'
  //     autoUpdater = require './auto-updater-win32'
  //   else
  //     autoUpdater = require 'auto-updater'
  //
  //   autoUpdater.on 'error', (event, message) =>
  //     @setState(ErrorState)
  //     console.error "Error Downloading Update: #{message}"
  //
  //   autoUpdater.setFeedUrl @feedUrl
  //
  //   autoUpdater.on 'checking-for-update', =>
  //     @setState(CheckingState)
  //
  //   autoUpdater.on 'update-not-available', =>
  //     @setState(NoUpdateAvailableState)
  //
  //   autoUpdater.on 'update-available', =>
  //     @setState(DownladingState)
  //
  //   autoUpdater.on 'update-downloaded', (event, releaseNotes, @releaseVersion) =>
  //     @setState(UpdateAvailableState)
  //     @emitUpdateAvailableEvent(@getWindows()...)
  //
  //   # Only check for updates periodically if enabled and running in release
  //   # version.
  //   @scheduleUpdateCheck() unless /\w{7}/.test(@version) or @disabled
  //
  //   switch process.platform
  //     when 'win32'
  //       @setState(UnsupportedState) unless autoUpdater.supportsUpdates()
  //     when 'linux'
  //       @setState(UnsupportedState)
  //
  // isDisabled: ->
  //   @disabled
  //
  // emitUpdateAvailableEvent: (windows...) ->
  //   return unless @releaseVersion?
  //   for atomWindow in windows
  //     atomWindow.sendMessage('update-available', {@releaseVersion})
  //   return
  //
  // setState: (state) ->
  //   return if @state is state
  //   @state = state
  //   @emit 'state-changed', @state
  //
  // getState: ->
  //   @state
  //
  // scheduleUpdateCheck: ->
  //   checkForUpdates = => @check(hidePopups: true)
  //   fourHours = 1000 * 60 * 60 * 4
  //   setInterval(checkForUpdates, fourHours)
  //   checkForUpdates()
  //
  // check: ({hidePopups}={}) ->
  //   unless hidePopups
  //     autoUpdater.once 'update-not-available', @onUpdateNotAvailable
  //     autoUpdater.once 'error', @onUpdateError
  //
  //   autoUpdater.checkForUpdates() unless @testMode
  //
  // install: ->
  //   autoUpdater.quitAndInstall() unless @testMode
  //
  // onUpdateNotAvailable: =>
  //   autoUpdater.removeListener 'error', @onUpdateError
  //   dialog = require 'dialog'
  //   dialog.showMessageBox
  //     type: 'info'
  //     buttons: ['OK']
  //     icon: @iconPath
  //     message: 'No update available.'
  //     title: 'No Update Available'
  //     detail: "Version #{@version} is the latest version."
  //
  // onUpdateError: (event, message) =>
  //   autoUpdater.removeListener 'update-not-available', @onUpdateNotAvailable
  //   dialog = require 'dialog'
  //   dialog.showMessageBox
  //     type: 'warning'
  //     buttons: ['OK']
  //     icon: @iconPath
  //     message: 'There was an error checking for updates.'
  //     title: 'Update Error'
  //     detail: message
  //
  // getWindows: ->
  //   global.atomApplication.windows




  // 
  // import platform from '../../utils/platform';
  // import request from 'request';
  // import semver from 'semver';
  // import dialog from 'dialog';
  //
  // import manifest from '../../../../package.json';
  //
  // if (platform.isLinux) {
  //   const options = {
  //     url: manifest.updater.manifestUrl,
  //     json: true
  //   };
  //
  //   log('checking for update', JSON.stringify(options));
  //   request(options, function(err, response, newManifest) {
  //     if (err) {
  //       log('update error while getting new manifest', err);
  //       dialog.showMessageBox({
  //         type: 'warning',
  //         message: 'Error while checking for update.',
  //         detail: err.message,
  //         buttons: ['OK']
  //       }, function() {});
  //       return;
  //     }
  //
  //     if (response.statusCode < 200 || response.statusCode >= 300) {
  //       log('update error statusCode', response.statusCode);
  //       dialog.showMessageBox({
  //         type: 'warning',
  //         message: 'Error while checking for update.',
  //         detail: response.statusMessage,
  //         buttons: ['OK']
  //       }, function() {});
  //       return;
  //     }
  //
  //     const newVersionExists = semver.gt(newManifest.version, manifest.version);
  //     if (newVersionExists) {
  //       log('new version exists', newManifest.version);
  //       dialog.showMessageBox({
  //         type: 'info',
  //         message: 'A new version is available: ' + newManifest.version,
  //         detail: 'Use your package manager to update, or click Download to get the new package.',
  //         buttons: ['OK', 'Download']
  //       }, function(response) {
  //         log('new version exists dialog response', response);
  //         if (response === 1) {
  //           const packageType = manifest.distrib.split('-')[1];
  //           const downloadUrl = newManifest.updater.linux[packageType][process.arch]
  //             .replace('%VERSION%', newManifest.version);
  //           shell.openExternal(downloadUrl);
  //         }
  //       });
  //     } else {
  //       log('app version up to date');
  //       dialog.showMessageBox({
  //         type: 'info',
  //         message: 'No update available.',
  //         detail: 'You\'re using the latest version: ' + manifest.version,
  //         buttons: ['OK']
  //       }, function() {});
  //     }
  //   });
  // }
