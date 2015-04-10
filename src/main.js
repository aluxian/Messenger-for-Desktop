var attached = false;

exports.watch = function(win) {
  if (attached) {
    return;
  } else {
    attached = true;
  }

  var titleRegExp = /\((\d)\)/;
  setInterval(function() {
    var match = titleRegExp.exec(win.title);
    var label = match && match[1] || '';
    win.setBadgeLabel(label);
  }, 250);
};
