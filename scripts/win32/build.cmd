npm install
cd src && npm install
gulp rebuild:32 --verbose
gulp pack:win32:portable --prod --verbose
gulp pack:win32:installer --prod --verbose
gulp clean:prev-releases:win32 --verbose
