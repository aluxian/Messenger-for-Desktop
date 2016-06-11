window.onerror = function (message, source, lineno, colno, error) {
  logError(error instanceof Error ? error : new Error(error || message));
};
