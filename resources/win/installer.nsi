!include "MUI2.nsh"

Name "{{ productName }}"
BrandingText "{{ homepage }}"
RequestExecutionLevel "admin"

OutFile "..\..\dist\{{ name }}-{{ version }}-win32-nsis.exe"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_LANGUAGE "English"

!define MUI_ICON "app.ico"
!define MUI_FINISHPAGE_RUN_TEXT "Start {{ productName }}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\{{ productName }}.exe"

Section

  SetShellVarContext "current"
  RMDir /r $INSTDIR

SectionEnd
