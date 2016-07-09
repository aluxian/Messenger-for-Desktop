@ECHO ON

CALL scripts\win32\build.cmd
CALL gulp publish:github --verbose
