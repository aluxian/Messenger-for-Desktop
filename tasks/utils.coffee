args = require './args'
require 'colors'

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
  platform: platform
  join: join
  log: log
