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
    echo Opening browser at: http://localhost:8000/
    echo.
    echo Press Ctrl+C in this window when you want to close the server.
    echo.
    start "" "http://localhost:8000/"
    python -m http.server 8000
    exit /b
) else (
    echo Python not found. Checking for Python3...
    python3 --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Starting Lexio with Python HTTP server...
        echo.
        echo Please leave this window open while using Lexio.
        echo Opening browser at: http://localhost:8000/
        echo.
        echo Press Ctrl+C in this window when you want to close the server.
        echo.
        start "" "http://localhost:8000/"
        python3 -m http.server 8000
        exit /b
    ) else (
        echo Python not found. Checking if Node.js is installed...
        where node >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo Starting Lexio with Node.js HTTP server...
            echo.
            echo Please leave this window open while using Lexio.
            echo Opening browser at: http://localhost:8000/
            echo.
            echo Press Ctrl+C in this window when you want to close the server.
            echo.
            
            echo const http = require('http'); > temp_server.js
            echo const fs = require('fs'); >> temp_server.js
            echo const path = require('path'); >> temp_server.js
            echo const port = 8000; >> temp_server.js
            echo. >> temp_server.js
            echo const server = http.createServer((req, res) ^=^> { >> temp_server.js
            echo   let filePath = '.' + req.url; >> temp_server.js
            echo   if (filePath === './') filePath = './index.html'; >> temp_server.js
            echo. >> temp_server.js
            echo   const extname = path.extname(filePath); >> temp_server.js
            echo   let contentType = 'text/html'; >> temp_server.js
            echo   switch (extname) { >> temp_server.js
            echo     case '.js': contentType = 'text/javascript'; break; >> temp_server.js
            echo     case '.css': contentType = 'text/css'; break; >> temp_server.js
            echo     case '.json': contentType = 'application/json'; break; >> temp_server.js
            echo     case '.png': contentType = 'image/png'; break; >> temp_server.js
            echo     case '.jpg': contentType = 'image/jpg'; break; >> temp_server.js
            echo   } >> temp_server.js
            echo. >> temp_server.js
            echo   fs.readFile(filePath, (err, content) ^=^> { >> temp_server.js
            echo     if (err) { >> temp_server.js
            echo       if (err.code === 'ENOENT') { >> temp_server.js
            echo         fs.readFile('./index.html', (err, content) ^=^> { >> temp_server.js
            echo           res.writeHead(404, { 'Content-Type': 'text/html' }); >> temp_server.js
            echo           res.end(content, 'utf-8'); >> temp_server.js
            echo         }); >> temp_server.js
            echo       } else { >> temp_server.js
            echo         res.writeHead(500); >> temp_server.js
            echo         res.end(`Server Error: ${err.code}`); >> temp_server.js
            echo       } >> temp_server.js
            echo     } else { >> temp_server.js
            echo       res.writeHead(200, { 'Content-Type': contentType }); >> temp_server.js
            echo       res.end(content, 'utf-8'); >> temp_server.js
            echo     } >> temp_server.js
            echo   }); >> temp_server.js
            echo }); >> temp_server.js
            echo. >> temp_server.js
            echo server.listen(port, () ^=^> { >> temp_server.js
            echo   console.log(`Server running at http://localhost:${port}/`); >> temp_server.js
            echo }); >> temp_server.js
            
            start "" "http://localhost:8000/"
            node temp_server.js
            del temp_server.js
            exit /b
        ) else (
            echo Python and Node.js not found, trying to open index.html directly...
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
            echo For best experience, install Python or Node.js and run this script again.
            echo.
            pause
            exit /b
        )
    )
)