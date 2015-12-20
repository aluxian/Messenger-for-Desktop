args = require './args'
cp = require 'child_process'
require 'colors'

applyPromise = (fn, args...) ->
  (cb) ->
    fn args...
      .then (results...) -> cb null, results...
      .catch cb

applySpawn = (cmd, opts = {}) ->
  (cb) ->
    opts.stdio = if args.verbose then 'inherit' else 'ignore'
    proc = cp.spawn cmd, opts
    if cb
      proc.on 'error', cb
      proc.on 'close', (code) ->
        cb (if code then "`#{cmd}` exited with code #{code}" else null)

platform = () ->
  arch = if process.arch == 'ia32' then '32' else '64'
  process.platform + arch

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
  platform: platform
  join: join
  log: log
