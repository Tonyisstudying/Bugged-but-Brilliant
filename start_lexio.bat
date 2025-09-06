@echo off
TITLE Lexio Quick Launcher
echo ====================================================
echo           Lexio Language Learning Platform
echo ====================================================
echo.

SET DEST_FOLDER=%USERPROFILE%\Documents\Lexio

REM Check if files already exist locally
IF EXIST "%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html" (
    echo Local copy found! Opening immediately...
    start "" "%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html"
    
    REM Ask about update in background after launching
    start /B cmd /c "choice /c YN /t 10 /d N /m "Update to the latest version? (Auto-No in 10s)" & if errorlevel 2 (exit) else (powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/Tonyisstudying/Bugged-but-Brilliant/archive/refs/heads/main.zip' -OutFile '%DEST_FOLDER%\lexio_latest.zip'}" & powershell -Command "& {Expand-Archive -Path '%DEST_FOLDER%\lexio_latest.zip' -DestinationPath '%DEST_FOLDER%' -Force}")"
    
    REM Start server if available
    where node >nul 2>nul
    IF %ERRORLEVEL% EQU 0 (
        IF EXIST "%DEST_FOLDER%\Bugged-but-Brilliant-main\package.json" (
            start /B cmd /c "cd /d "%DEST_FOLDER%\Bugged-but-Brilliant-main" && node JS\server.js"
        )
    )
    goto END
)

REM First-time setup
echo First time setup - Installing Lexio...
IF NOT EXIST "%DEST_FOLDER%" mkdir "%DEST_FOLDER%"
cd /d "%DEST_FOLDER%"

echo Downloading from GitHub (showing progress)...
powershell -Command "& {$progressPreference = 'Continue'; Invoke-WebRequest -Uri 'https://github.com/Tonyisstudying/Bugged-but-Brilliant/archive/refs/heads/main.zip' -OutFile 'lexio_latest.zip'}"

echo Extracting files...
powershell -Command "& {Expand-Archive -Path 'lexio_latest.zip' -DestinationPath '.' -Force}" >nul 2>&1

echo Creating desktop shortcut...
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\Lexio.lnk');$s.TargetPath='%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html';$s.WorkingDirectory='%DEST_FOLDER%\Bugged-but-Brilliant-main';$s.Save()"

echo Launching Lexio...
IF EXIST "%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html" (
    start "" "%DEST_FOLDER%\Bugged-but-Brilliant-main\index.html"
) ELSE (
    echo ERROR: Installation failed.
    pause
    exit /b 1
)

REM Optional: Start server
where node >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    IF EXIST "%DEST_FOLDER%\Bugged-but-Brilliant-main\package.json" (
        echo Starting server...
        start /B cmd /c "cd /d "%DEST_FOLDER%\Bugged-but-Brilliant-main" && node JS\server.js"
    )
)

:END
echo.
echo ====================================================
echo Lexio is ready! Enjoy learning languages.
echo ====================================================
exit /b 0