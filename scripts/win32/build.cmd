@ECHO ON
CALL npm install
cd src
CALL npm install
cd ..
CALL gulp rebuild:32 --verbose
CALL gulp pack:win32:portable --prod --verbose
CALL gulp pack:win32:installer --prod --verbose
CALL gulp clean:prev-releases:win32 --verbose
