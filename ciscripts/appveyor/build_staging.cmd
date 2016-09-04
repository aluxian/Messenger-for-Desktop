@ECHO ON

CALL ciscripts\appveyor\build.cmd
CALL gulp publish:bintray:artifacts:win32 --verbose
