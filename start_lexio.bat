@echo off
REM Lexio Website Launcher - Direct Open Version
TITLE Lexio Launcher

echo ====================================================
echo       Launching Lexio Language Learning Platform
echo ====================================================
echo.

REM Change to the batch file's directory
cd /d "%~dp0"

REM Check if index.html exists
IF NOT EXIST "index.html" (
    echo ERROR: index.html not found in the current directory.
    echo Please make sure you're running this from the correct folder.
    echo.
    pause
    exit /b 1
)

REM Try to open the website directly first (works for everyone)
echo Opening Lexio in your default browser...
start "" "index.html"
echo Website opened successfully!
echo.
echo Note: If some features don't work, you may need to install Node.js
echo from https://nodejs.org/ for full functionality.
echo.

REM Optional: Try to start a server in the background for enhanced features
echo Checking if we can start a local server for better functionality...
where node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    IF EXIST "node_modules\" (
        echo Starting Node.js server in background...
        start /B node JS/server.js >nul 2>&1
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
echo If the website didn't open, manually open: %~dp0index.html
echo.
pause