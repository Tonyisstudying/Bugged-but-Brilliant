@echo off
TITLE Lexio Language Learning
echo ====================================================
echo       Welcome to Lexio Language Learning
echo ====================================================
echo.

setlocal

REM Get the directory where the batch file is located
cd /d "%~dp0"

REM Check if index.html exists in the same directory as the batch file
if exist "index.html" (
    echo Starting Lexio...
    start "" "index.html"
    echo Lexio has been launched!
) else (
    echo ERROR: index.html was not found in this directory.
    echo Current directory: %CD%
    echo.
    echo Please make sure:
    echo  - You've extracted all files from the zip archive
    echo  - The batch file is in the same folder as index.html
    echo.
    pause
)

echo.
echo You can close this window now.
timeout /t 5
exit /b 0

