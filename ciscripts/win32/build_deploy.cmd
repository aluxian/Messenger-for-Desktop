@ECHO ON

CALL ciscripts\win32\build.cmd
CALL gulp publish:github --verbose
