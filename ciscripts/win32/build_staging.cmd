@ECHO ON

CALL scripts\win32\build.cmd
CALL gulp publish:bintray:artifacts:win32 --verbose
