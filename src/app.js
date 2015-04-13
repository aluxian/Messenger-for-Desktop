'use strict';

var gui = require('nw.gui');
var win = gui.Window.get();
var isLinux = process.platform == 'linux';
var isOSX = process.platform == 'darwin';
var tray;
var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();

// Create the menu
var menu = new gui.Menu({ type: 'menubar' });
if (menu.createMacBuiltin) 
{
	menu.createMacBuiltin('Messenger');
}

win.menu = menu;
	
//Change icon
events.on('traymenu:unread', function () {
	tray.icon = "icon_unread.png";
});

//Original icon
events.on('traymenu:read', function () {
	tray.icon = "icon.png";
});

//Create tray menu
var trayMenu = new gui.Menu();
trayMenu.append(new gui.MenuItem({ label: 'Open Messenger' }));
trayMenu.append(new gui.MenuItem({ label: 'Quit Messenger' }));

//Create tray
tray = new gui.Tray({title : 'Messenger', tooltip: 'Facebook Messenger', icon: 'icon.png'});
tray.menu = trayMenu;

//Define tray menu functions
trayMenu.items[0].click = function() {
	win.show();
};

trayMenu.items[1].click = function() {
	tray.remove();
	tray = null;
	win.close(true);
};

// All: Don't quit the app when the window is closed
win.on('close', function(quit) {
	if (quit) {
		win.close(true);
	} 
	else {
		trayMenu.items[1].enabled = false;
		win.hide();
	}
});


// All: Re-show the window when the dock icon is pressed
gui.App.on('reopen', function() {
	win.show();
	trayMenu.items[1].enabled = true;
});

// Open external urls in the browser
win.on('new-win-policy', function(frame, url, policy) {
	gui.Shell.openExternal(url);
	policy.ignore();
});

// Listen for DOM load
window.onload = function() {
	var app = document.getElementById('app');
	var titleRegExp = /\((\d)\)/;

	// Watch the iframe every 300ms
	setInterval(function() {
	
		// Sync the title
		document.title = app.contentDocument.title;

		// Update the badge
		var match = titleRegExp.exec(document.title);
		var label = match && match[1] || '';

		//TODO : Fix tray icon for Linux
		//if(match) events.emit("traymenu:unread");
		//else events.emit("traymenu:read");

		win.setBadgeLabel(label);
	}, 250);
}
