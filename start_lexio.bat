@echo off
TITLE Lexio Launcher
echo ====================================================
echo       Welcome to Lexio Language Learning
echo ====================================================
echo.

REM Get the directory where the batch file is located
cd /d "%~dp0"

REM Check if index.html exists in the current directory
if exist "index.html" (
    REM Open the local HTML file directly
    start "" "index.html"
    echo Lexio has been launched!
) else (
    echo ERROR: index.html was not found in this directory.
    echo Current directory: %CD%
    echo.
    echo Please make sure you extracted all files from the zip archive
    echo and are running this batch file from the correct location.
)

echo.
pause