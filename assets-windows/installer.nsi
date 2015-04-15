Name "Messenger"

# define the resulting installer's name:
OutFile "..\dist\MessengerSetup.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Messenger for Desktop\"

# default section start
Section

  # delete already installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\Messenger\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall Messenger for Desktop.exe"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$SMPROGRAMS\Messenger.lnk" "$INSTDIR\Messenger.exe"
  CreateShortCut "$SMPROGRAMS\Uninstall Messenger for Desktop.lnk" "$INSTDIR\Uninstall Messenger for Desktop.exe"
  CreateShortCut "$DESKTOP\Messenger.lnk" "$INSTDIR\Messenger.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"

  # delete the installed files
  RMDir /r $INSTDIR

  # delete the shortcuts
  Delete "$SMPROGRAMS\Messenger.lnk"
  Delete "$SMPROGRAMS\Uninstall Messenger for Desktop.lnk"
  Delete "$DESKTOP\Messenger.lnk"

SectionEnd
