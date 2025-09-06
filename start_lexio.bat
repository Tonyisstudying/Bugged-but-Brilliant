@echo off
REM Lexio Website Launcher
TITLE Lexio Launcher

echo ====================================================
echo       Launching Lexio Language Learning Platform
echo ====================================================
echo.

SET SERVER_STARTED=0
SET PORT=3000

REM Create folder for logs
IF NOT EXIST logs\ mkdir logs

REM Check if Node.js is installed and working (preferred method)
echo Checking for Node.js...
where node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    echo Node.js found! Starting server...
    
    REM Check if npm packages are installed
    IF NOT EXIST node_modules\ (
        echo Installing required packages...
        call npm install
        IF %ERRORLEVEL% NEQ 0 (
            echo ERROR: Failed to install packages
            goto NODE_FAILED
        )
    )
    
    cd /d "%~dp0"
    start "" http://localhost:%PORT%
    echo Server starting on http://localhost:%PORT%
    echo.
    echo Press Ctrl+C to stop the server when finished.
    node JS/server.js > logs\server.log 2>&1
    SET SERVER_STARTED=1
    goto END
)

:NODE_FAILED
echo Node.js failed or not found, trying Python...

REM Try to use Python
where python >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    echo Python found! Starting simple server...
    cd /d "%~dp0"
    SET PORT=8000
    start "" http://localhost:%PORT%
    echo Server starting on http://localhost:%PORT%
    echo.
    echo Press Ctrl+C to stop the server when finished.
    python -m http.server %PORT% > logs\server.log 2>&1
    SET SERVER_STARTED=1
    goto END
)

REM Try Python3 if python command doesn't work
where python3 >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    echo Python3 found! Starting simple server...
    cd /d "%~dp0"
    SET PORT=8000
    start "" http://localhost:%PORT%
    echo Server starting on http://localhost:%PORT%
    echo.
    echo Press Ctrl+C to stop the server when finished.
    python3 -m http.server %PORT% > logs\server.log 2>&1
    SET SERVER_STARTED=1
    goto END
)

REM If we get here, nothing worked
IF %SERVER_STARTED% EQU 0 (
    echo ====================================================
    echo ERROR: No server software found on your system.
    echo ====================================================
    echo.
    echo To run this website, you have these options:
    echo.
    echo 1. Install Node.js (RECOMMENDED):
    echo    - Download from: https://nodejs.org/
    echo    - Make sure to check "Add to PATH" during installation
    echo.
    echo 2. Install Python:
    echo    - Download from: https://www.python.org/downloads/
    echo    - Make sure to check "Add to PATH" during installation
    echo.
    echo 3. Open the website manually:
    echo    - Navigate to: %~dp0index.html
    echo    - Double-click to open in your browser
    echo    (Note: Some features may not work correctly)
    echo.
    echo After installing software, run this batch file again.
    echo.
    echo ====================================================
    echo For help, see: %~dp0README.md
    echo ====================================================
    
    REM Offer to try opening the file directly
    echo.
    SET /P OPEN_DIRECT=Would you like to open index.html directly now? (Y/N): 
    IF /I "%OPEN_DIRECT%"=="Y" (
        start "" "%~dp0index.html"
    )
    
    pause
)

:END
echo.
echo If the website didn't open automatically, go to:
echo http://localhost:%PORT%
echo.
echo Check logs\server.log if you encounter any issues.
echo.