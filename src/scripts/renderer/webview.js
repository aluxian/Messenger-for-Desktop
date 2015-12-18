// Log console messages
const webView = document.getElementById('webView');
webView.addEventListener('console-message', function(event) {
  log(event.message);
});
