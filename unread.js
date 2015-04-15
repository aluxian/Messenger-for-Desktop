var gui = require('nw.gui');
var win = gui.Window.get();
var checkread = function()
{
	var app = document.getElementById('app');
	var titleRegExp = /\d/;
        // Sync the title
        document.title = app.contentDocument.title;
        // Update the badge
        var match = titleRegExp.exec(document.title);
        var label = match && match[0] || '';
	console.log(label);
	if(label != "")
	{
		//tray.tooltip = toolTip + label;
			events.emit('unread');
	}
	else
	{
		//tray.tooltip = toolTip + '0';
			events.emit('read');
	}
	// setBadgeLabel doesn't work on Linux. Change the icon instead
	if(isLinux)
	{
		if(label!='')
		{
			// tray.icon = 'icon_unread.png';
			events.emit('unread');
		}
		else
		{
			// tray.icon = 'icon.png';
			events.emit('read');
		}
	}
        win.setBadgeLabel(label);
}
