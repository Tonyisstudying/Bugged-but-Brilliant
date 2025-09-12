@echo off
TITLE Lexio Language Learning
echo ====================================================
echo       Welcome to Lexio Language Learning
echo ====================================================
echo.

setlocal

REM Get the directory where the batch file is located
cd /d "%~dp0"

REM Default port for the server
set PORT=8080

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Opening in simple mode...
    goto simple_launch
)

REM Check if http-server is installed globally
call npm list -g http-server >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing http-server...
    call npm install -g http-server
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install http-server. Opening in simple mode...
        goto simple_launch
    )
)

echo Starting Lexio workspace server on port %PORT%...

REM Check if port is already in use
netstat -ano | findstr ":%PORT%" >nul
if %ERRORLEVEL% EQU 0 (
    echo Port %PORT% is already in use. Trying port 8081...
    set PORT=8081
    
    REM Check if the new port is also in use
    netstat -ano | findstr ":%PORT%" >nul
    if %ERRORLEVEL% EQU 0 (
        echo Port %PORT% is also in use. Opening in simple mode...
        goto simple_launch
    )
)

REM Start the server
start "Lexio Server" cmd /c "http-server ./ -p %PORT% -c-1 --cors"

REM Wait for the server to start
timeout /t 2 /nobreak >nul

echo Lexio server is running on http://localhost:%PORT%
echo.
echo Opening Lexio in your browser...
start "" "http://localhost:%PORT%"

echo.
echo Lexio has been launched successfully!
echo.
echo NOTE: Keep this window open while using Lexio.
echo       Close this window when you're done to stop the server.
echo.
echo Press any key to stop the server and exit...
pause >nul
taskkill /fi "WINDOWTITLE eq Lexio Server*" >nul 2>&1
exit /b 0

:simple_launch
echo Starting Lexio in simple mode...
if exist "index.html" (
    start "" "index.html"
    echo Lexio has been launched!
) else (
    echo ERROR: index.html was not found in this directory.
    echo Current directory: %CD%
)
echo.
echo Note: Simple mode may not support all features.
echo       Some functionality might be limited.
echo.
pause