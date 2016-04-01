import repl from 'repl';
import net from 'net';

import manifest from '../../../package.json';

/**
 * Create the server and start listening on the given port.
 */
export function createServer(port) {
  log('listening for REPL connections on port', port);
  net.createServer(socket => {
    const r = repl.start({
      prompt: 'browser@' + manifest.name + '> ',
      input: socket,
      output: socket,
      terminal: true
    });

    r.on('exit', () => {
      socket.end();
    });

    // Bridge loggers
    r.context.log = log;
    r.context.logError = logError;
    r.context.logFatal = logFatal;
  }).listen(3499);
}
