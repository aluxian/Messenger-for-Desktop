@ECHO ON
CALL scripts\win32\import_cert.cmd
CALL scripts\win32\build.cmd
gulp publish:bintray:artifacts:win32 --verbose
