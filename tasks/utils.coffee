args = require './args'
async = require 'async'
spawn = require 'cross-spawn'
fs = require 'fs'
require 'colors'

updateManifest = (jsonPath, updateFn, done) ->
  async.waterfall [
    async.apply fs.readFile, jsonPath, 'utf8'
    (file, callback) ->
      json = JSON.parse file
      updateFn json
      text = JSON.stringify json
      fs.writeFile jsonPath, text, 'utf8', callback
  ], done

applyPromise = (fn, args...) ->
  (cb) ->
    fn args...
      .then (results...) -> cb null, results...
      .catch cb

applySpawn = (cmd, params, opts = {}) ->
  (cb) ->
    unless opts.stdio
      opts.stdio = if args.verbose then 'inherit' else 'ignore'
    if args.verbose
      console.log 'spawning', cmd
    child = spawn cmd, params, opts
    if cb
      errored = false
      child.on 'error', (err) ->
        errored = true
        if args.verbose
          console.log 'finished: spawn', cmd
        cb(err)
      child.on 'close', (code) ->
        unless errored
          if code
            err = new Error "`#{cmd} #{params.join(' ')}` exited with code #{code}"
            err.code = code
            if args.verbose
              console.log 'finished: spawn', cmd
            cb err
          else
            if args.verbose
              console.log 'finished: spawn', cmd
            cb null

applyIf = (cond, fn) ->
  if cond
    fn
  else
    (cb) -> cb(null)

platform = ->
  if process.platform is 'win32'
    process.platform
  else
    arch = if process.arch is 'ia32' then '32' else '64'
    process.platform + arch

platformOnly = ->
  if process.platform is 'win32'
    'win'
  else
    process.platform

join = (args) ->
  (val for own key, val of args).join ' '

log = (callback, messages...) ->
  (err) ->
    if args.verbose
      status = if err then 'Failed'.red else 'Successful'.green
      console.log status, join(messages)
    callback err

deepClone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime())

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags)

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = deepClone obj[key]

  newInstance

module.exports =
  updateManifest: updateManifest
  applyPromise: applyPromise
  applySpawn: applySpawn
  applyIf: applyIf
  platform: platform
  platformOnly: platformOnly
  join: join
  log: log
  deepClone: deepClone
