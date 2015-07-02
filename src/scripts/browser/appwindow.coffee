BrowserWindow = require 'browser-window'
path = require 'path'
url = require 'url'
_ = require 'lodash'

{EventEmitter} = require 'events'

class AppWindow extends EventEmitter
  constructor: (options) ->
    @loadSettings = bootstrapScript: require.resolve '../renderer/main'
    @loadSettings = _.extend @loadSettings, options

    windowOpts =
      width: 800
      height: 600
      'web-preferences':
        'subpixel-font-scaling': true
        'direct-write': true

    windowOpts = _.extend windowOpts, @loadSettings

    @window = new BrowserWindow windowOpts

    @window.on 'closed', (e) =>
      @emit 'closed', e

    @window.on 'devtools-opened', (e) =>
      @window.webContents.send 'window:toggle-dev-tools', true

    @window.on 'devtools-closed', (e) =>
      @window.webContents.send 'window:toggle-dev-tools', false

  show: ->
    targetUrl = url.format
      protocol: 'file'
      pathname: path.resolve __dirname, '..', '..', 'static', 'index.html'
      slashes: true
      query:
        loadSettings: JSON.stringify @loadSettings

    @window.loadUrl targetUrl
    @window.show()

  reload: ->
    @window.webContents.reload()

  toggleFullScreen: ->
    @window.setFullScreen(not @window.isFullScreen())

  toggleDevTools: ->
    @window.toggleDevTools()

  close: ->
    @window.close()
    @window = null

module.exports = AppWindow
