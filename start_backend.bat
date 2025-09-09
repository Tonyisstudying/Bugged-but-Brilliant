@echo off
echo ====================================
echo Setting up Lexio Backend...
echo ====================================

echo Installing dependencies...
npm install

echo Creating necessary directories...
if not exist "logs" mkdir logs

echo Testing server...
echo Starting server for 5 seconds to test...
timeout /t 2 /nobreak > nul
start /min cmd /c "node JS/server.js"
timeout /t 3 /nobreak > nul

echo ====================================
echo Backend setup complete!
echo ====================================
echo.
echo To start the server manually:
echo   npm start
echo.
echo To test the API:
echo   Visit: http://localhost:3000/api/test
echo ====================================
pause