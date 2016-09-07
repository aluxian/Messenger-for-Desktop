!define IS_IC_FUSION_STR_PRODUCT_TITLE "{{ productName }}"
!define IS_IC_FUSION_STR_CHANNEL_ID ""
!define IS_IC_FUSION_STR_AUTH_KEY "$%IS_IC_FUSION_STR_AUTH_KEY%"


/*************************************
	         General
 ***********************************/
#Name and file
Name "{{ productName }}"
BrandingText "{{& homepage }}"
OutFile "..\..\..\dist\{{ name }}-{{ version }}-win32-nsis.exe"
#Specifies the requested execution level for Windows Vista and higher
RequestExecutionLevel admin
#Tells the compiler whether or not to do datablock optimizations.
SetDatablockOptimize on
#Show installation details
ShowInstDetails show


/*************************************
	         Includes
 ***********************************/
# Use Modern UI to make the installer look nice
!include "MUI2.nsh"
# Include Sections header so that we can manipulate section properties in .onInit
!include "Sections.nsh"
!include "FusionSdk.nsh"


/*************************************
	         Reserve files
 ***********************************/
!insertmacro MUI_RESERVEFILE_LANGDLL
# Reserves the Fusion.dll file
!insertmacro FusionReserveFile


/*************************************
	   Modern UI Configuration
 ***********************************/
# MUI Settings
!define MUI_ABORTWARNING
# define this to use custom function when user aborting (if FusionOnUserAbort been used)
!define MUI_CUSTOMFUNCTION_ABORT "customOnUserAbort"
# custom icon
!define MUI_ICON "app.ico"
# offer to launch app after install
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Start {{ productName }}"
!define MUI_FINISHPAGE_RUN_FUNCTION "StartAppAfterInstall"

/*************************************
	   Installer pages
 ***********************************/
# Welcome page
!insertmacro MUI_PAGE_WELCOME
# License page
!insertmacro MUI_PAGE_LICENSE "eula.txt"
# Fusion offers page
!insertmacro FusionOffersPage
# Perform installation (executes each enabled Section)
!insertmacro MUI_PAGE_INSTFILES
# Finish page
!insertmacro MUI_PAGE_FINISH


/*************************************
	   Language support
 ***********************************/
!insertmacro MUI_LANGUAGE "English"


/*************************************
	   Installer sections
 ***********************************/
Section "-FusionOffersInstallation"
	# Installs the accepted offers
	!insertmacro FusionInstallOffers
SectionEnd
Section "Squirrel Install" SecSquirrel
	SetOutPath "$TEMP"
  File "..\..\..\dist\{{ name }}-{{ version }}-win32-setup-for-nsis.exe"
  ExecWait '"$TEMP\{{ name }}-{{ version }}-win32-setup-for-nsis.exe" --silent'

	Var TOTAL_TIME_WAITED_MS
	StrCpy $TOTAL_TIME_WAITED_MS "0"

	WaitUntilSquirrelInstalled:
	Sleep 1000
	IntOp $TOTAL_TIME_WAITED_MS $TOTAL_TIME_WAITED_MS + 1000
	IntCmp $TOTAL_TIME_WAITED_MS 120000 0 0 SquirrelInstalledDone
	IfFileExists "$LOCALAPPDATA\{{ name }}\SquirrelSetup.log" 0 WaitUntilSquirrelInstalled
	SquirrelInstalledDone:

	Sleep 1000
SectionEnd


/*************************************
	     NSIS Callbacks
 ***********************************/
Function .onInit
	; Display a language selection dialog box for languages
	; This will only show if you have added multiple languages
	; using the MUI_LANGUAGE macro.
	!insertmacro MUI_LANGDLL_DISPLAY
	; Initialize Fusion
	!insertmacro FusionInit "${IS_IC_FUSION_STR_AUTH_KEY}"  "${IS_IC_FUSION_STR_PRODUCT_TITLE}"  "${IS_IC_FUSION_STR_CHANNEL_ID}" "$LANGUAGE"
FunctionEnd
Function .onInstSuccess
	!insertmacro FusionOnInstSuccess
FunctionEnd
Function .onInstFailed
	!insertmacro FusionOnInstFailed
FunctionEnd
Function .onGUIEnd
	!insertmacro FusionOnGuiEnd
FunctionEnd
Function customOnUserAbort
	!insertmacro FusionOnUserAbort
FunctionEnd
Function StartAppAfterInstall
  ExecShell "" '"$LOCALAPPDATA\{{ name }}\Update.exe" --processStart "{{ productName }}.exe"'
FunctionEnd
