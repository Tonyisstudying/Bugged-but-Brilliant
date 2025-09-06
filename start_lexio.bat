@echo off
TITLE Lexio GitHub Launcher
echo ====================================================
echo       Launching Lexio from GitHub Repository
echo ====================================================
echo.

REM Create a destination folder if it doesn't exist
SET DEST_FOLDER=%USERPROFILE%\Documents\Lexio
IF NOT EXIST "%DEST_FOLDER%" (
    echo Creating Lexio folder...
    mkdir "%DEST_FOLDER%"
)

cd /d "%DEST_FOLDER%"

echo Downloading latest version from GitHub...
echo This may take a moment depending on your internet speed...

REM Use PowerShell to download the ZIP file from GitHub
powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/Tonyisstudying/Bugged-but-Brilliant/archive/refs/heads/main.zip' -OutFile 'lexio_latest.zip'}" >nul 2>&1

IF NOT EXIST "lexio_latest.zip" (
    echo ERROR: Failed to download from GitHub. Please check your internet connection.
    pause
    exit /b 1
)

echo Download complete!
echo Extracting files...

REM Remove old files (but keep the zip for next time)
IF EXIST "Bugged-but-Brilliant-main" (
    rmdir /S /Q "Bugged-but-Brilliant-main"
)

REM Extract the ZIP file
powershell -Command "& {Expand-Archive -Path 'lexio_latest.zip' -DestinationPath '.' -Force}" >nul 2>&1

echo Launching Lexio...

REM Check if extraction was successful
IF EXIST "Bugged-but-Brilliant-main\index.html" (
    REM Try to open in browser directly
    start "" "Bugged-but-Brilliant-main\index.html"
    echo Website opened successfully!
) ELSE IF EXIST "Bugged-but-Brilliant-main\pages\login.html" (
    REM Fallback to login page
    start "" "Bugged-but-Brilliant-main\pages\login.html"
    echo Website opened successfully!
) ELSE (
    echo ERROR: Could not find website files after extraction.
    echo Please report this issue on GitHub.
    pause
    exit /b 1
)

REM Optional: Check if a local server can be started
echo.
echo Checking if we can start a local server for better functionality...
where node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    IF EXIST "Bugged-but-Brilliant-main\package.json" (
        cd "Bugged-but-Brilliant-main"
        echo Node.js found! Installing dependencies...
        call npm install >nul 2>&1
        echo Starting Node.js server...
        start /B cmd /C "node JS\server.js" >nul 2>&1
        timeout /t 2 /nobreak >nul
        echo Server started! You can also access Lexio at: http://localhost:3000
        start "" http://localhost:3000
    )
)

echo.
echo ====================================================
echo Lexio is now ready!
echo ====================================================
echo.
echo Your local copy is stored at: %DEST_FOLDER%
echo.
echo To create a desktop shortcut, press any key...
pause >nul

REM Create desktop shortcut
echo Creating desktop shortcut...
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\Lexio.lnk');$s.TargetPath='%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html';$s.WorkingDirectory='%DEST_FOLDER%\Bugged-but-Brilliant-main';$s.Save()"

echo Shortcut created! You can now launch Lexio directly from your desktop.
echo.
echo Press any key to exit...
pause >nul