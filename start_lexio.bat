@echo off
REM Lexio Website Launcher

echo Launching Lexio Language Learning Platform...
echo.

REM Try to use Python (commonly pre-installed on many systems)
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server using Python...
    cd /d "%~dp0"
    start "" http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Try Python3 if python command doesn't work
where python3 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server using Python3...
    cd /d "%~dp0"
    start "" http://localhost:8000
    python3 -m http.server 8000
    goto :end
)

REM Try Node.js if installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting server using Node.js...
    cd /d "%~dp0"
    start "" http://localhost:3000
    node JS/server.js
    goto :end
)

REM If nothing works, provide instructions
echo.
echo No suitable server was found on your system.
echo To run this website, you have a few options:
echo.
echo 1. Open index.html directly in your web browser
echo   (Note: Some features may not work correctly)
echo.
echo 2. Install a lightweight web server:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
echo After installing either one, run this batch file again.
echo.
pause

:end