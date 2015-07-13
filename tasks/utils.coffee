require 'colors'

verbose = '--verbose' in process.argv

join = (args) ->
  str = ''
  str += ' ' + val for own key, val of args
  return str.trim()

module.exports =
  log: (callback, messages...) -> (err) ->
    if verbose
      console.log (if err then 'Failed'.red else 'Successful'.green), join(messages), '|', join(arguments)
    callback(err)
