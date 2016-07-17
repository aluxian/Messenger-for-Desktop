!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "Messenger"
BrandingText "aluxian.com"
RequestExecutionLevel "admin"

# set the icon
!define MUI_ICON "icon.ico"

# define the resulting installer's name:
OutFile "..\dist\Messenger_win32_V150_beta1.exe"

# set the installation directory
InstallDir "$PROGRAMFILES\Messenger for Desktop\"

# app dialogs
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN_TEXT "Start Messenger"
!define MUI_FINISHPAGE_RUN $INSTDIR\Messenger.exe

!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

# default section start
Section
  # set the current shell context to the current users
  SetShellVarContext "current"
  # delete the installed files
  RMDir /r $INSTDIR

  # define the path to which the installer should install
  SetOutPath $INSTDIR

  # specify the files to go in the output path
  File /r ..\build\Messenger\win32\*

  # create the uninstaller
  WriteUninstaller "$INSTDIR\Uninstall Messenger for Desktop.exe"

  # Register the uninstaller to Add/Remove Programs
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MessengerForDesktop" \
                 "DisplayName" "Messenger For Desktop"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MessengerForDesktop" \
                 "UninstallString" "$\"$INSTDIR\Uninstall Messenger for Desktop.exe$\""

  # Calculate program size and store in registry
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MessengerForDesktop" \ 
                 "EstimatedSize" "$0"

  # create shortcuts in the start menu and on the desktop
  CreateShortCut "$APPDATA\Microsoft\Windows\Start Menu\Programs\Messenger.lnk" "$INSTDIR\Messenger.exe"
  CreateShortCut "$APPDATA\Microsoft\Windows\Start Menu\Programs\Uninstall Messenger for Desktop.lnk" "$INSTDIR\Uninstall Messenger for Desktop.exe"
  CreateShortCut "$DESKTOP\Messenger.lnk" "$INSTDIR\Messenger.exe"

SectionEnd

# create a section to define what the uninstaller does
Section "Uninstall"
  # set the current shell context to the current users
  SetShellVarContext "current"
  # delete the installed files
  RMDir /r $INSTDIR

  # Delete cached data
  RMDir /r $LOCALAPPDATA\Messenger

  # Delete the registry key for uninstaller
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\MessengerForDesktop"

  # delete the shortcuts
  Delete "$APPDATA\Microsoft\Windows\Start Menu\Programs\Messenger.lnk"
  Delete "$APPDATA\Microsoft\Windows\Start Menu\Programs\Uninstall Messenger for Desktop.lnk"
  Delete "$DESKTOP\Messenger.lnk"

SectionEnd
