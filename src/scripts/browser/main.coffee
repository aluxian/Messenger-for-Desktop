app = require 'app'
path = require 'path'
fs = require 'fs-plus'

Application = require './application'

# NB: Hack around broken native modules atm
nslog = console.log

global.shellStartTime = Date.now()

process.on 'uncaughtException', (error={}) ->
  nslog(error.message) if error.message?
  nslog(error.stack) if error.stack?

parseCommandLine = ->
  version = app.getVersion()

  yargs = require 'yargs'
    .alias('d', 'dev').boolean('d').describe('d', 'Run in development mode.')
    .alias('h', 'help').boolean('h').describe('h', 'Print this usage message.')
    .alias('l', 'log-file').string('l').describe('l', 'Log all output to file.')
    .alias('r', 'resource-path').string('r').describe('r', 'Set the path to the App source directory and enable dev-mode.')
    .alias('t', 'test').boolean('t').describe('t', 'Run the specified specs and exit with error code on failures.')
    .alias('v', 'version').boolean('v').describe('v', 'Print the version.')

  args = yargs.parse process.argv[1..]
  process.stdout.write "#{JSON.stringify args}\n"

  if args.help
    help = ''
    yargs.showHelp((s) -> help += s)
    process.stdout.write "#{help}\n"
    process.exit 0

  if args.version
    process.stdout.write "#{version}\n"
    process.exit 0

  devMode = args['dev']
  test = args['test']
  exitWhenDone = test
  logFile = args['log-file']

  if args['resource-path']
    devMode = true
    resourcePath = args['resource-path']

    if devMode
      resourcePath ?= global.devResourcePath

  unless fs.statSyncNoException resourcePath
    resourcePath = path.join process.resourcesPath, 'app.asar'

  resourcePath = path.resolve resourcePath
  {resourcePath, devMode, test, exitWhenDone, logFile}

setupCoffeeScript = ->
  CoffeeScript = null

  require.extensions['.coffee'] = (module, filePath) ->
    CoffeeScript ?= require 'coffee-script'
    coffee = fs.readFileSync filePath, 'utf8'
    js = CoffeeScript.compile coffee, filename: filePath
    module._compile js, filePath

start = ->
  # Enable ES6 in the Renderer process
  app.commandLine.appendSwitch 'js-flags', '--harmony'

  args = parseCommandLine()

  if args.devMode
    app.commandLine.appendSwitch 'remote-debugging-port', '8315'

  # Note: It's important that you don't do anything with Electron
  # unless it's after 'ready', or else mysterious bad things will happen
  # to you.
  app.on 'ready', ->
    setupCoffeeScript()
    require('../babel').register()

    if args.devMode
      require(path.join(args.resourcePath, 'src', 'coffee-cache')).register()
      Application = require path.join(args.resourcePath, 'src', 'browser', 'application')
    else
      Application = require './application'

    global.application = new Application args
    console.log("App load time: #{Date.now() - global.shellStartTime}ms") unless args.test

start()
