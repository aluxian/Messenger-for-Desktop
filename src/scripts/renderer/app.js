const webView = document.getElementById('webView');

// Set the user agent and then load the app
webView.setAttribute('useragent', navigator.userAgent);
webView.setAttribute('src', 'https://web.whatsapp.com/');
