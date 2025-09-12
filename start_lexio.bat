@echo off
TITLE Lexio Language Learning
echo ====================================================
echo       Welcome to Lexio Language Learning
echo ====================================================
echo.

REM Get the directory where the batch file is located
cd /d "%~dp0"

echo Checking for Python...
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting Lexio with Python HTTP server...
    echo.
    echo Please leave this window open while using Lexio.
    echo Open your browser and go to: http://localhost:8000/
    echo.
    echo Press Ctrl+C in this window when you want to close the server.
    echo.
    python -m http.server 8000
    exit /b
) else (
    echo Python not found. Checking for Python3...
    python3 --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Starting Lexio with Python HTTP server...
        echo.
        echo Please leave this window open while using Lexio.
        echo Open your browser and go to: http://localhost:8000/
        echo.
        echo Press Ctrl+C in this window when you want to close the server.
        echo.
        python3 -m http.server 8000
        exit /b
    ) else (
        echo Python not found, trying to open index.html directly...
        echo Note: Navigation might not work correctly with direct file access.
        echo.
        
        if exist "index.html" (
            start "" "index.html"
            echo Lexio has been launched, but navigation may be limited.
        ) else (
            echo ERROR: index.html was not found in this directory.
            echo Current directory: %CD%
            echo.
            echo Please make sure the batch file is in the same folder as index.html
        )
        
        echo.
        echo For best experience, install Python and run this script again.
        echo.
        pause
        exit /b
    )
)