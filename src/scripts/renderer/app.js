import '../scripts/renderer/webview';
import '../scripts/renderer/webview-listeners';
import '../scripts/renderer/webview-events';
import '../scripts/renderer/crash-reporter';
import '../scripts/renderer/analytics';
import '../scripts/renderer/airbrake';
import '../scripts/renderer/keymap';

window.onerror = function(message, source, lineno, colno, error) {
  error.__skip_log = true;
  logError(error);
};
