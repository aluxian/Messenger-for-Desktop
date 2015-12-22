args = require './args'
cp = require 'child_process'
require 'colors'

applyPromise = (fn, args...) ->
  (cb) ->
    fn args...
      .then (results...) -> cb null, results...
      .catch cb

applySpawn = (cmd, params, opts = {}) ->
  (cb) ->
    opts.stdio = if args.verbose then 'inherit' else 'ignore'
    child = cp.spawn cmd, params, opts
    if cb
      errored = false
      child.on 'error', (err) ->
        errored = true
        cb(err)
      child.on 'close', (code) ->
        unless errored
          if code
            cb "`#{cmd} #{params.join(' ')}` exited with code #{code}"
          else
            cb null

applyIf = (cond, fn) ->
  if cond
    fn
  else
    (cb) -> cb(null)

platform = () ->
  if process.platform == 'win32'
    process.platform
  else
    arch = if process.arch == 'ia32' then '32' else '64'
    process.platform + arch

isCurrentDist = (dist) ->
  dist == platform()

join = (args) ->
  (val for own key, val of args).join ' '

log = (callback, messages...) ->
  (err) ->
    if args.verbose
      status = if err then 'Failed'.red else 'Successful'.green
      console.log status, join(messages), '|', join(arguments)
    callback err

module.exports =
  applyPromise: applyPromise
  applySpawn: applySpawn
  applyIf: applyIf
  platform: platform
  isCurrentDist: isCurrentDist
  join: join
  log: log
