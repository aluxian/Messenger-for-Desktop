window.onerror = function(message, source, lineno, colno, error) {
  error.__skip_console_log = true;
  logError(error);
};
