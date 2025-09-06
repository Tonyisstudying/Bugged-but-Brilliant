@echo off
REM Lexio Website Launcher - Self-extracting Version
TITLE Lexio Launcher

echo ====================================================
echo       Launching Lexio Language Learning Platform
echo ====================================================
echo.

REM Check if running from a temporary directory
echo Current directory: %cd%
SET TEMP_DIR=%cd%
SET CONTAINS_TEMP=0
IF "%TEMP_DIR%"=="%TEMP_DIR:Temp=%"  (SET CONTAINS_TEMP=0) ELSE (SET CONTAINS_TEMP=1)
IF "%TEMP_DIR%"=="%TEMP_DIR:temp=%"  (SET CONTAINS_TEMP=0) ELSE (SET CONTAINS_TEMP=1)
IF "%TEMP_DIR%"=="%TEMP_DIR:Rar$=%"  (SET CONTAINS_TEMP=1)
IF "%TEMP_DIR%"=="%TEMP_DIR:ZIP=%"   (SET CONTAINS_TEMP=1)

REM If in temp directory, copy to Documents
IF %CONTAINS_TEMP%==1 (
    echo Detected temporary directory. Setting up proper installation...
    
    REM Create destination folder in Documents
    SET DEST_FOLDER=%USERPROFILE%\Documents\Lexio
    IF NOT EXIST "%DEST_FOLDER%" mkdir "%DEST_FOLDER%"
    
    echo Installing Lexio to: %DEST_FOLDER%
    
    REM Copy all files recursively (only if in temp folder)
    xcopy "%cd%\*.*" "%DEST_FOLDER%" /E /H /I /Y

    echo.
    echo Installation complete!
    
    REM Create desktop shortcut
    echo Creating desktop shortcut...
    powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\Lexio.lnk');$s.TargetPath='%DEST_FOLDER%\start_lexio.bat';$s.WorkingDirectory='%DEST_FOLDER%';$s.Save()"
    
    REM Launch from new location
    echo Launching Lexio from installed location...
    start "" "%DEST_FOLDER%\start_lexio.bat"
    exit /b 0
)

REM Normal startup flow - not in temp directory
cd /d "%~dp0"

REM Check if structure is valid
IF NOT EXIST "pages\login.html" (
    IF EXIST "index.html" (
        REM Just a partial structure, but index exists
        echo WARNING: Found partial website structure.
        echo Will launch index.html but some features may not work.
        goto LAUNCH_SITE
    ) ELSE (
        echo ERROR: Required files not found. This may not be a complete Lexio installation.
        echo Please download the complete project from GitHub.
        pause
        exit /b 1
    )
)

:LAUNCH_SITE
echo Opening Lexio in your default browser...

REM Try opening index.html directly
IF EXIST "index.html" (
    start "" "index.html"
) ELSE IF EXIST "pages\login.html" (
    start "" "pages\login.html"
) ELSE (
    echo ERROR: Could not find any HTML files to open.
    pause
    exit /b 1
)

echo Website opened successfully!
echo.
echo Note: For the best experience, you may need Node.js
echo from https://nodejs.org/ for full functionality.
echo.

REM Optional: Try to start a server in the background for enhanced features
echo Checking if we can start a local server for better functionality...
where node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    IF EXIST "node_modules\" (
        echo Starting Node.js server in background...
        start /B node JS/server.js >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo Server started! You can also access at: http://localhost:3000
    ) ELSE (
        echo Node.js found but dependencies not installed.
        echo Run 'npm install' for full server functionality.
    )
) ELSE (
    where python >nul 2>nul
    IF %ERRORLEVEL% EQU 0 (
        echo Starting Python server in background...
        start /B python -m http.server 8000 >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo Server started! You can also access at: http://localhost:8000
    ) ELSE (
        echo No server software found. Website opened in basic mode.
    )
)

echo.
echo ====================================================
echo Lexio is now open in your browser!
echo ====================================================
echo.
echo If the website didn't open, manually open: %cd%\index.html
echo.

REM Add a first-run notice for new users
IF NOT EXIST "%TEMP%\lexio_ran_before.txt" (
    echo This file indicates Lexio has run before > "%TEMP%\lexio_ran_before.txt"
    echo.
    echo ====================================================
    echo FIRST RUN NOTICE:
    echo ====================================================
    echo.
    echo If you're enjoying Lexio, please consider:
    echo 1. Creating a desktop shortcut (manually or run again)
    echo 2. Installing Node.js for full functionality
    echo.
    echo For help or issues, visit:
    echo https://github.com/Tonyisstudying/Bugged-but-Brilliant
    echo.
)

pause