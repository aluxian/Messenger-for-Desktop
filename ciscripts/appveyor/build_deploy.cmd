@ECHO ON

CALL ciscripts\appveyor\build.cmd
CALL gulp publish:github --verbose
