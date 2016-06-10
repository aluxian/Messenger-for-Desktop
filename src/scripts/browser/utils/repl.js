import repl from 'repl';
import net from 'net';

import logger from 'common/utils/logger';

/**
 * Create the server and start listening on the given port.
 */
export function createServer (port) {
  log('listening for REPL connections on port', port);
  net.createServer((socket) => {
    const r = repl.start({
      prompt: 'browser@' + global.manifest.name + '> ',
      input: socket,
      output: socket,
      terminal: true
    });

    r.on('exit', () => {
      socket.end();
    });

    // Bridge loggers
    r.context.log = logger.debugLogger('repl');
    r.context.logError = logger.errorLogger('repl', false);
    r.context.logFatal = logger.errorLogger('repl', true);
  }).listen(port);
}
