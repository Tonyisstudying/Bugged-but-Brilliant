@echo off
TITLE Lexio Language Learning
echo ====================================================
echo       Welcome to Lexio Language Learning
echo ====================================================
echo.

REM Get the directory where the batch file is located
cd /d "%~dp0"

echo Starting Lexio...

REM Check if index.html exists in the current directory
if exist "index.html" (
    REM Open the index.html file directly in the default browser
    start "" "index.html"
    echo Lexio has been launched successfully!
) else (
    echo ERROR: index.html was not found in this directory.
    echo Current directory: %CD%
    echo.
    echo Please make sure the batch file is in the same folder as index.html
)

echo.
echo You can close this window now.
timeout /t 5
exit /b