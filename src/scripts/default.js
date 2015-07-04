import shell from 'shell';

// Open links in an external browser
document.onclick = function(e) {
  e.preventDefault();

  if (e.target.tagName === 'A') {
    shell.openExternal(e.target.href);
  }

  return false;
};
