@ECHO ON

CALL ciscripts\win32\build.cmd
CALL gulp publish:bintray:artifacts:win32 --verbose
