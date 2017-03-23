/******************************************************************************* 
                              FusionSDK.nsh 
*******************************************************************************/  

!ifndef _FUSIONSDK_NSH
!define _FUSIONSDK_NSH

/******************************************************************************* 
                    Include Necessary NSIS Libaries  
*******************************************************************************/  

!include nsDialogs.nsh
!include FileFunc.nsh
!include LogicLib.nsh
!include WinMessages.nsh
!include WinVer.nsh
!insertmacro GetParameters

/******************************************************************************* 
                              Fusion Definitions 
*******************************************************************************/
# DO NOT CHANGE - this value must be identical to Fusion.dll version
!define FUSION_SDK_VERSION "1.47"  

# Fusion dll functions ordinal numbers
!define FUS_InitDll 1
!define FUS_SetOffersWindow 2
!define FUS_ShowOffers 3
!define FUS_NextOffer 4
!define FUS_InstallOffers 5
!define FUS_SetMainProductStatus 6
!define FUS_WaitAndFreeDll 7
!define FUS_WaitForOffersToBeReady 8
!define FUS_HideOffers 9
!define FUS_GetDllState 10
!define FUS_GetOffersProgress 11
!define FUS_GetOffersProgressEx 12
!define FUS_SetMainProductValuesA 13
!define FUS_SetMainProductValuesW 14
!define FUS_GetOfferCaptionA 15
!define FUS_GetOfferCaptionW 16
!define FUS_SetOffersBackgroundColor 17
!define FUS_FreeDll 18
!define FUS_SetOffersWindowEx 19

# Fusion dll states
!define FUS_DLL_STATE_NOT_STARTED 0
!define FUS_DLL_STATE_DLL_INIT 1
!define FUS_DLL_STATE_OFFERS_PAGE_ENABLED 2
!define FUS_DLL_STATE_OFFER_SHOWN 3
!define FUS_DLL_STATE_NO_MORE_OFFERS 4
!define FUS_DLL_STATE_INSTALLING_OFFERS 5
!define FUS_DLL_STATE_OFFERS_INSTALLED 6
!define FUS_DLL_STATE_DLL_FREED 7
!define FUS_DLL_STATE_ERROR_OCCURED 8

;migrated from System.nsh
; typedef struct _RECT { 
;   LONG left; 
;   LONG top; 
;   LONG right; 
;   LONG bottom; 
; } RECT, *PRECT; 
!define stRECT "(i, i, i, i) p"


/* The following definitions can be overridden before #include'ing this header */
/*******************************************************************************/

/*	IS_IC_MAX_LOADING_TIME is the maximum time in milliseconds that loading progress bar may be shown 
	when wizard enters the offers page. Normally, offers are shown sooner. Setting this value too low
	may reduce offer rate. You could override this value by defining it in your script before !include'ing this header.
*/
!ifndef IS_IC_MAX_LOADING_TIME
	!define IS_IC_MAX_LOADING_TIME 13000
!endif

/*	Fusion offers installation may not been finished on deinitialization, and proceed the insallation silently after click on "finish"
	This behaviour occured when using FusionDeinitializeSetup.
	In order to override this default definition (3 minutes), define it in your .nsi file before !includ'ing FusionSdk.nsh  
*/
!ifndef IS_IC_MAX_SILENT_INSTALLATION_TIME_SEC
	!define IS_IC_MAX_SILENT_INSTALLATION_TIME_SEC 180
!endif

!ifndef FUS_UPDATE_CAPTION_MACRO
	!define FUS_UPDATE_CAPTION_MACRO _UPDATE_OFFER_CAPTION_MUI
!endif

!ifndef FUS_CAPTION_BASIC_NSIS_CUSTOM_DLGID
	!define FUS_CAPTION_BASIC_NSIS_CUSTOM_DLGID 1037
!endif

!ifndef FUS_DESCRIPTION_BASIC_NSIS_CUSTOM_DLGID
	!define FUS_DESCRIPTION_BASIC_NSIS_CUSTOM_DLGID 1038
!endif

# Fusion offer page's default caption and description. Should be shown in case of offer without other values. 
!ifndef FUS_DEFAULT_OFFER_CAPTION
	!define FUS_DEFAULT_OFFER_CAPTION "Install Additional Software"
!endif

!ifndef FUS_DEFAULT_OFFER_DESCRIPTION
	!define FUS_DEFAULT_OFFER_DESCRIPTION "Recommended for your computer"
!endif

!ifndef FUS_MAX_CAPTION_LEN
	!define FUS_MAX_CAPTION_LEN 50
!endif

!ifndef FUS_MAX_DESC_LEN
	!define FUS_MAX_DESC_LEN 100
!endif

/******************************************************************************* 
                            Fusion Global Variables 
*******************************************************************************/ 

Var _gl_FUS_DllHandle
Var _gl_FUS_NoFusion
Var _gl_FUS_SkipOffersPage
Var _gl_FUS_IsAbortedByUser
Var _gl_FUS_Reg9BckUp
# offers window measurements
Var _gl_FUS_OffersWinHWND
Var _gl_FUS_OffersWinX   	;default 10
Var _gl_FUS_OffersWinY   	;default 62
Var _gl_FUS_OffersWinWidth	;default 482
Var _gl_FUS_OffersWinHeight	;default 241

/******************************************************************************* 
                      Fusion Internal Functions & Macros
*******************************************************************************/

!macro _UpdateMainProductValues
	!ifdef NSIS_UNICODE		
		!insertmacro _CallFusAPIFunc ${FUS_SetMainProductValuesW} "(w '$INSTDIR', w '$EXEPATH',  w '')"
	!else		
		!insertmacro _CallFusAPIFunc ${FUS_SetMainProductValuesA} "(m '$INSTDIR', m '$EXEPATH',  m '')"
	!endif 
!macroend
/*******************************************************************************/
# Sets the offers page's caption and description
# Compatible with ModernUI, ModernUI2, UltraModernUI libraries.
!macro _UPDATE_OFFER_CAPTION_MUI CAPTION DESCRIPTION
	!ifmacrondef MUI_HEADER_TEXT
		!error "Can't find the macro MUI_HEADER_TEXT. Include your UI framework header before including FusionSdk.nsh. In case you are not using a framework with MUI_HEADER_TEXT support, define in your code !define FUS_UPDATE_CAPTION_MACRO _UPDATE_OFFER_CAPTION_BASIC_NSIS ."		
	!endif	
	!insertmacro MUI_HEADER_TEXT "${CAPTION}" "${DESCRIPTION}"	
!macroend
/*******************************************************************************/
/*
 Sets the offers page's caption and description.
 Compatible with the basic NSIS UI framework.

 Usage:

   !define FUS_UPDATE_CAPTION_MACRO _UPDATE_OFFER_CAPTION_BASIC_NSIS
   !include FusionSdk.nsh

 You may customize this macro by overriding the following definitions before !include'ing FusionSdk.nsh:

   FUS_DISABLE_CAPTION_BASIC_NSIS            -> If defined, disables the update of the offer's caption
   FUS_DISABLE_DESCRIPTION_BASIC_NSIS        -> If defined, disables the update of the offer's description
   FUS_CAPTION_BASIC_NSIS_CUSTOM_DLGID       -> Dialog ID to update with the caption text
   FUS_DESCRIPTION_BASIC_NSIS_CUSTOM_DLGID   -> Dialog ID to update with the description text 
*/
!macro _UPDATE_OFFER_CAPTION_BASIC_NSIS CAPTION DESCRIPTION
	Push "${DESCRIPTION}"	#push the 2 parameters into the stack
	Push "${CAPTION}"
	Exch $0	# $0 contains caption
	Exch 1	# description is the top value of the stack	 
	Exch $1	# $1 contains description
	Push $2
	!ifndef FUS_DISABLE_CAPTION_BASIC_NSIS
		GetDlgItem $2 $HWNDPARENT ${FUS_CAPTION_BASIC_NSIS_CUSTOM_DLGID}
		${If} $2 <> 0
			SendMessage $2 ${WM_SETTEXT} 0 "STR:$0"
		${Endif}
	!endif
	!ifndef FUS_DISABLE_DESCRIPTION_BASIC_NSIS
		GetDlgItem $2 $HWNDPARENT ${FUS_DESCRIPTION_BASIC_NSIS_CUSTOM_DLGID}
		${If} $2 <> 0
			SendMessage $2 ${WM_SETTEXT} 0 "STR:$1"
		${Endif}
	!endif
	Pop $2
	Pop $1
	Pop $0
!macroend
/*******************************************************************************/
!macro _GetAndUpdateOfferCaptionAndDescription
	Push $0
	Push $1
	Push $2
	Push $3
	Push $4
	
	System::Call /NOUNLOAD "*(&t${FUS_MAX_CAPTION_LEN} '') i .r2" # $2 points to a buffer for caption
	System::Call /NOUNLOAD "*(&t${FUS_MAX_DESC_LEN} '') i .r3" # $3 points to a buffer for description
	
	# Get caption and description from dll
	!ifdef NSIS_UNICODE		
		!insertmacro _CallFusAPIFunc ${FUS_GetOfferCaptionW} "(i r2, i r3, i ${FUS_MAX_CAPTION_LEN}, i ${FUS_MAX_DESC_LEN})i .s"		
	!else 			
		!insertmacro _CallFusAPIFunc ${FUS_GetOfferCaptionA} "(i r2, i r3, i ${FUS_MAX_CAPTION_LEN}, i ${FUS_MAX_DESC_LEN})i .s"
	!endif
	Pop $4	# result of dll call
	
	System::Call /NOUNLOAD "*$2(&t${FUS_MAX_CAPTION_LEN} .s)"
	Pop $0
	System::Call /NOUNLOAD "*$3(&t${FUS_MAX_DESC_LEN} .s)"
	Pop $1
	
	${If} $4 == 0
	${OrIf} $0 == ""
		StrCpy $0 "${FUS_DEFAULT_OFFER_CAPTION}"
		StrCpy $1 "${FUS_DEFAULT_OFFER_DESCRIPTION}"
	${EndIf}
	
	Pop $4
	System::Free $3
	System::Free $2
	Pop $3
	Pop $2
	
	# Set the offers page caption & description
	!insertmacro ${FUS_UPDATE_CAPTION_MACRO} $0 $1
	Pop $1
	Pop $0	
!macroend
/*******************************************************************************/
# Enable = 0 disabling, 1=enabling 
!macro _EnableUIButtons Enable
	Push $0
	Push $1
	${For} $0 1 3 # 1:Next, 2:Cancel, 3:Back			
		GetDlgItem $1 $HWNDPARENT $0
		EnableWindow $1 ${Enable}			
	${Next}
	Pop $1
	Pop $0
!macroend

# Simulates click on "next", to abort the offers page via callback
!macro _ManualAbortPage
	System::Call "User32.dll::SetActiveWindow(i $HWNDPARENT)i .n"
	Push $0
	GetDlgItem $0 $HWNDPARENT 1
	SendMessage $0 ${BM_CLICK} 0 0
	Pop $0
!macroend

# Calls to the specified API function by its ordinal number. 
!macro _CallFusAPIFunc Ordinal Params	
	StrCpy $_gl_FUS_Reg9BckUp $9
	System::Call "kernel32::GetProcAddress(i $_gl_FUS_DllHandle,i ${Ordinal})i.r9"		
	System::Call /NOUNLOAD "::$9 ${Params}"	 
	StrCpy $9 $_gl_FUS_Reg9BckUp	
!macroend

Function _AdjustFusWinSize
	;Save existing register values to the stack
	Push $0
	Push $1
	Push $2
	Push $3
	Push $4
	Push $5
	Push $6
	Push $7	
 
	; Reposition window in the lower left
	; Create RECT struct
	System::Call "*${stRECT} .r1"
	
	!ifdef NSIS_UNICODE
	${If} ${AtLeastWinVista}
	!endif
		; Find Window info for the window we're displaying
		System::Call "User32::GetWindowRect(i, i) i ($_gl_FUS_OffersWinHWND, r1) .r2"
	!ifdef NSIS_UNICODE
	${EndIf}
	!endif

	; Get left/top/right/bottom
	System::Call "*$1${stRECT} (.r2, .r3, .r4, .r5)"
 
	; Calculate width/height of our window
	IntOp $2 $4 - $2 ; $2 now contains the width
	IntOp $3 $5 - $3 ; $3 now contains the height	
 
	; Calculate the offers window width - 96% of installer width
	IntOp $4 $2 * 96
	IntOp $4 $4 / 100
	StrCpy $_gl_FUS_OffersWinWidth $4
	${If} $_gl_FUS_OffersWinWidth == 0 
		StrCpy $_gl_FUS_OffersWinWidth 480
	${Endif}
	
	; Calculate the offers window height - 62% of installer height
	IntOp $4 $3 * 62
	IntOp $4 $4 / 100
	StrCpy $_gl_FUS_OffersWinHeight $4
	${If} $_gl_FUS_OffersWinHeight == 0 
		StrCpy $_gl_FUS_OffersWinHeight 240
	${Endif}
	
	; Calculate the offers window x offset - 2% of installer width
	IntOp $4 $2 * 2
	IntOp $4 $4 / 100
	StrCpy $_gl_FUS_OffersWinX $4
	${If} $_gl_FUS_OffersWinX == 0 
		StrCpy $_gl_FUS_OffersWinX 8
	${Endif}
	
	; Calculate the offers window y offset - 16% of installer height
	IntOp $4 $3 * 16
	IntOp $4 $4 / 100
	StrCpy $_gl_FUS_OffersWinY $4
	${If} $_gl_FUS_OffersWinY == 0 
		StrCpy $_gl_FUS_OffersWinY 64
	${Endif}
	
	System::Free $1	
 
	;Restore register values from the stack
	Pop $7
	Pop $6
	Pop $5
	Pop $4
	Pop $3
	Pop $2
	Pop $1
	Pop $0
FunctionEnd

/******************************************************************************* 
									Fusion API
*******************************************************************************/

# Reserves the Fusion.dll file
!macro FusionReserveFile
	ReserveFile ".\Fusion.dll"	
!macroend
/*******************************************************************************/
!macro FusionInit Secret ProductTitle ChannelID LanguageCode
	#initialize the global variables 
	StrCpy $_gl_FUS_NoFusion 0		
	StrCpy $_gl_FUS_SkipOffersPage 0
	StrCpy $_gl_FUS_IsAbortedByUser 0	

	#turn fusion off in case of silent installer, same as '/NOFUSION' flag usage from command line
	IfSilent 0 +2
		StrCpy $_gl_FUS_NoFusion 1
		
	# extract Fusion files
	InitPluginsDir
	${IfNot} ${FileExists} "$PLUGINSDIR\Fusion.dll"
		File "/oname=$PLUGINSDIR\Fusion.dll" ".\Fusion.dll"
	${EndIf}
	
	# Initialize Fusion.dll
	Push $0
	Push $1
	StrCpy $0 "$PLUGINSDIR\Fusion.dll"
	System::Call "kernel32::LoadLibrary(t r0)i .r1"
	StrCpy $_gl_FUS_DllHandle $1	
	Pop $1
	Pop $0				
	!insertmacro _CallFusAPIFunc ${FUS_InitDll} "(m '${Secret}', m '${ProductTitle}',  m '${ChannelID}',  m '${LanguageCode}', i $_gl_FUS_NoFusion, m '${FUSION_SDK_VERSION}')i .s"
	Exch $0	
	${If} $0 != 1
		StrCpy $_gl_FUS_NoFusion 1
	${Else}
		!insertmacro _UpdateMainProductValues
	${EndIf}	
	Pop $0

	Call _AdjustFusWinSize
	!insertmacro _CallFusAPIFunc ${FUS_SetOffersWindow} "(i 0, i $_gl_FUS_OffersWinX,  i $_gl_FUS_OffersWinY, i $_gl_FUS_OffersWinWidth, i $_gl_FUS_OffersWinHeight)"
!macroend
/*******************************************************************************/
!macro FusionOffersPage
	Function _FusionOffersPageShowCallback
		# Kill the timer
		${NSD_KillTimer} _FusionOffersPageShowCallback
		
		${If} $_gl_FUS_NoFusion == 1
		${OrIf} $_gl_FUS_SkipOffersPage == 1
			!insertmacro _ManualAbortPage
		${EndIf}
		
		# Update offer's caption and description
		!insertmacro _GetAndUpdateOfferCaptionAndDescription
		
		System::Call "User32.dll::SetActiveWindow(i $HWNDPARENT)i .n"	
		
		# Show first offer		
		!insertmacro _CallFusAPIFunc ${FUS_ShowOffers} "(i ${IS_IC_MAX_LOADING_TIME})i .s"
		Exch $0			
		${If} $0 == 0
			StrCpy $_gl_FUS_SkipOffersPage 1			
		${EndIf}
		Pop $0
		
		# Update offer's caption and description
		!insertmacro _GetAndUpdateOfferCaptionAndDescription
		
		!insertmacro _EnableUIButtons 1		
		
		${If} $_gl_FUS_SkipOffersPage == 1
			!insertmacro _ManualAbortPage	
		${EndIf}		
	FunctionEnd
	
	Function _FusionOffersPageBack
		# Detach the offers windows			
		!insertmacro _CallFusAPIFunc ${FUS_SetOffersWindow} "(i 0, i 0,  i 0, i 0, i 0)"	
	FunctionEnd
	
	Function _FusionOffersPageStart		
		${If} $_gl_FUS_NoFusion == 1
		${OrIf} $_gl_FUS_SkipOffersPage == 1
			Abort
		${EndIf}	

		# Skip this page if there is no more offers to shown		
		!insertmacro _CallFusAPIFunc ${FUS_GetDllState} "()i .s"			
		Exch $0 #state of Fusion dll in $0
		
		${If} $0 > ${FUS_DLL_STATE_OFFER_SHOWN}
			StrCpy $_gl_FUS_SkipOffersPage 1
			Abort
		${EndIf}
		Pop $0				
		
		# Create the offers window
		nsDialogs::Create /NOUNLOAD 1018
		Exch $0 #HWND of the offers window is within $0
		# Abort in case of error
		${If} $0 != error				
			# Set the offers windows
			System::Call "user32.dll::GetParent(i r0)i .r0"	
			StrCpy $_gl_FUS_OffersWinHWND $0
			Call _AdjustFusWinSize
			!insertmacro _CallFusAPIFunc ${FUS_SetOffersWindow} "(i $_gl_FUS_OffersWinHWND, i $_gl_FUS_OffersWinX,  i $_gl_FUS_OffersWinY, i $_gl_FUS_OffersWinWidth, i $_gl_FUS_OffersWinHeight)"				
		${Else}
			StrCpy $_gl_FUS_SkipOffersPage 1			
		${EndIf}	
		Pop $0
		
		!insertmacro _EnableUIButtons 0
		
		# Show the actual loading+offer page via callback
		${NSD_CreateTimer} _FusionOffersPageShowCallback 1
		
		# Add Back button handler - Detach the nsDialogs handler
		Push $0
		GetFunctionAddress $0 _FusionOffersPageBack
		nsDialogs::OnBack $0
		Pop $0
		
		# Show offers window
		nsDialogs::Show		
	FunctionEnd
	
	Function _FusionOffersPageLeave		
		${If} $_gl_FUS_NoFusion == 0
			!insertmacro _EnableUIButtons 0			
			!insertmacro _CallFusAPIFunc ${FUS_NextOffer} "()i .s"
			Exch $0	# $0=0 if there is no more offers, 1 otherwise			
			${If} $0 == 1  # There is new offer to show
				!insertmacro _GetAndUpdateOfferCaptionAndDescription
				!insertmacro _EnableUIButtons 1
				Pop $0
				Abort
			${EndIf}
			Pop $0
			# Detach the offers windows							
			!insertmacro _CallFusAPIFunc ${FUS_SetOffersWindow} "(i 0, i 0,  i 0, i 0, i 0)"
			!insertmacro _EnableUIButtons 1
			StrCpy $_gl_FUS_SkipOffersPage 1	
		${EndIf}
	FunctionEnd	

	Function _FusionDummyPageStart		
		!insertmacro _EnableUIButtons 1 # Validate that UI buttons are enabled
		Abort
	FunctionEnd		
	
	PageEx custom		
		PageCallbacks _FusionOffersPageStart _FusionOffersPageLeave
	PageExEnd
	
	PageEx custom		
		PageCallbacks _FusionDummyPageStart 
	PageExEnd
!macroend
/*******************************************************************************/
/*
	Installs the accepted offers.
	Needs to be inserted in an install hidden section that always runs.
	Usage example:
		Section "-FusionOffersInstallation"
			!insertmacro FusionInstallOffers
		SectionEnd
*/
!macro FusionInstallOffers	
	${If} $_gl_FUS_NoFusion == 0		
		!insertmacro _CallFusAPIFunc ${FUS_GetDllState} "()i .s"	
		Exch $0 #state of Fusion dll in $0
		${If} $0 == ${FUS_DLL_STATE_OFFER_SHOWN}
		${OrIf} $0 == ${FUS_DLL_STATE_NO_MORE_OFFERS}
			!insertmacro _UpdateMainProductValues			
			!insertmacro _CallFusAPIFunc ${FUS_InstallOffers} "()"
		${EndIf}		
		Pop $0		
	${EndIf}
!macroend
/*******************************************************************************/
/*
	Updates Fusion API about the main carrier installation success.
	Needs to be inserted inside the event .onInstSuccess
*/
!macro FusionOnInstSuccess
	${If} $_gl_FUS_NoFusion == 0
		# if we never report 0=success from the script,
        # the DLL will correctly eventually report non-success during clean-up		
		!insertmacro _CallFusAPIFunc ${FUS_SetMainProductStatus} "(i 0)"
	${EndIf}
!macroend
/*******************************************************************************/
/*
	Updates Fusion API about the main carrier installation failure.
	Needs to be called inside the event .onInstFailed
*/
!macro FusionOnInstFailed
	${If} $_gl_FUS_NoFusion == 0		
		!insertmacro _CallFusAPIFunc ${FUS_SetMainProductStatus} "(i -1)"
	${EndIf}
!macroend
/*******************************************************************************/
/*
	Completes the accepted offers installation, and deinitialize the dll.
	Needs to be inserted inside the event .onGUIEnd
*/
!macro FusionOnGuiEnd
	${If} $_gl_FUS_NoFusion == 0		
		${If} $_gl_FUS_IsAbortedByUser == 0			
			!insertmacro _CallFusAPIFunc ${FUS_WaitAndFreeDll} "(i ${IS_IC_MAX_SILENT_INSTALLATION_TIME_SEC})"
		${Else}			
			!insertmacro _CallFusAPIFunc ${FUS_FreeDll} "()"
		${EndIf}
		
		${If} $_gl_FUS_DllHandle != 0			
			System::Call "kernel32::FreeLibrary(i $_gl_FUS_DllHandle)"			
		${EndIf}
	${EndIf}
	StrCpy $_gl_FUS_NoFusion 1
!macroend
/******************************************************************************* 
									Fusion Helpers
*******************************************************************************/
/*
	Deinitialize the Fusion API immedietly, if the user is attempting to abort the installation.
	Can be inserted in the .onUserAbort callback function, or in MUI_CUSTOMFUNCTION_ABORT function
*/
!macro FusionOnUserAbort 	
	${If} $_gl_FUS_NoFusion == 0			
		StrCpy $_gl_FUS_IsAbortedByUser 1		
	${EndIf}
!macroend
/*
  Sets the background color of the offers. 
  By default, the background color is gray (which is the default background of Windows).
  Use this in case your installer has a custom backgroud color.
  This helper procedure could be called at any point of the installer flow, after FusionInitializeWizard has been called.
  
  Parameters:
      Color     : the hex code of the desired color in '#RGB' form, where R, G, B
                 are each zero-padded hex values in range 00-FF.
*/
!macro FusionSetOffersPageBackground Color
	${If} $_gl_FUS_NoFusion == 0		
		!insertmacro _CallFusAPIFunc ${FUS_SetOffersBackgroundColor} "(i ${Color})"		
	${EndIf}	
!macroend
/*                                                 
  Wait for at least 1 offer to be ready, and returns true when Fusion is ready to show offers (or if there is no offers to show, 
  after running all the relevant checkers), false in case of time out.
  Use this in order to postpone the arrival to the offer page.

  Parameters:
      TimeOutMS : Time out for waiting for offer, in millisecond.
  ReturnValue : (pushed into the stack)
	  1 if returned value is true, 0 otherwise.
*/
!macro FusionWaitForOffer TimeOutMS		
    ${If} $_gl_FUS_NoFusion == 0		
		!insertmacro _CallFusAPIFunc ${FUS_WaitForOffersToBeReady} "(i ${TimeOutMS})i .s"			
	${Else}
		Push 1
	${EndIf}	 
!macroend
/*   
  If the application encounter an error, and you want to monetize it in the analytics reports from IC, 
  Use this function with error code different from 0.
  This function should be called only before installing/finish page (because arrival these pages is considered as success)
  and before calling to FusionDeinitializeSetup (because this considered as user quit and not an error).

  report can be sent only once.

  Parameters:
      ErrorCode : uniuqe nonzero error code.
*/
!macro FusionReportInstallationError ErrorCode
	${If} $_gl_FUS_NoFusion== 0
	${AndIf} $ErrorCode != 0		
		!insertmacro _CallFusAPIFunc ${FUS_SetMainProductStatus} "(i ${ErrorCode})"			
	${EndIf}  
!macroend
/*
  Retrieves the progress of the offers download and installation (a number between 0 to MaxProgress).
  Use this to update your progress bar and to prevent Fusion to install offers silently.
  If progress=MaxProgress, Calling to FusionDeinitializeSetup will close the application immedietly, 
  without waiting.
  Parameters:
		MaxProgress : The maximum value of the progress (define the 100% value). Higher value returns higher precision.
  Return value: (pushed into the stack)
		The current progress
*/
!macro FusionGetOffersProgress MaxProgress	
	${If} $_gl_FUS_NoFusion == 0		
		!insertmacro _CallFusAPIFunc ${FUS_GetOffersProgress} "(i ${MaxProgress})i .s"			
	${Else}
		Push MaxProgress
	${EndIf}	
!macroend


!endif # !ifdef _FUSIONSDK_NSH