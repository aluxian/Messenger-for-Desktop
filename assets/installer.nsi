!define PRODUCT_NAME "Messenger"

Name "${PRODUCT_NAME}"

# define the resulting installer's name:
OutFile "..\dist\MessengerSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Messenger for Desktop\"

# default section start
Section

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  # these are the Windows files produced by grunt-node-webkit-builder
  File ..\build\Messenger\win32\Messenger.exe
  File ..\build\Messenger\win32\ffmpegsumo.dll
  File ..\build\Messenger\win32\icudtl.dat
  File ..\build\Messenger\win32\libEGL.dll
  File ..\build\Messenger\win32\libGLESv2.dll
  File ..\build\Messenger\win32\nw.pak

  SetOutPath $INSTDIR\locales
  File ..\build\Messenger\win32\locales\*
  SetOutPath $INSTDIR

  # define the uninstaller name
  WriteUninstaller "$INSTDIR\Uninstall Messenger for Desktop.exe"

  # create a shortcut in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Messenger.lnk" "$INSTDIR\Messenger.exe"
  CreateShortCut "$DESKTOP\Messenger.lnk" "$INSTDIR\Messenger.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the uninstaller
  Delete "$INSTDIR\Uninstall Messenger for Desktop.exe"

  # delete the installed files
  Delete $INSTDIR\Messenger.exe
  Delete $INSTDIR\ffmpegsumo.dll
  Delete $INSTDIR\icudtl.dat
  Delete $INSTDIR\libEGL.dll
  Delete $INSTDIR\libGLESv2.dll
  Delete $INSTDIR\nw.pak
  Delete $INSTDIR\locales\*
  Delete $INSTDIR\locales
  Delete $INSTDIR

  # delete the shortcuts
  Delete $SMPROGRAMS\Messenger.lnk
  Delete $DESKTOP\Messenger.lnk

SectionEnd
