# Lexio Launcher - PowerShell Edition
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "       Launching Lexio Language Learning Platform" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$serverStarted = $false
$port = 3000

# Create logs directory if it doesn't exist
if (!(Test-Path -Path "logs")) {
    New-Item -ItemType Directory -Path "logs" | Out-Null
}

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
    
    # Check for node_modules
    if (!(Test-Path -Path "node_modules")) {
        Write-Host "Installing required packages..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to install packages"
        }
    }
    
    # Start Node.js server
    Write-Host "Starting server on http://localhost:$port" -ForegroundColor Green
    Start-Process "http://localhost:$port"
    node JS/server.js | Tee-Object -FilePath "logs\server.log"
    $serverStarted = $true
} 
catch {
    Write-Host "Node.js failed or not found: $_" -ForegroundColor Red
    Write-Host "Trying Python..." -ForegroundColor Yellow
    
    # Try Python
    try {
        $port = 8000
        $pythonVersion = python --version
        Write-Host "Python found: $pythonVersion" -ForegroundColor Green
        Write-Host "Starting simple server on http://localhost:$port" -ForegroundColor Green
        Start-Process "http://localhost:$port"
        python -m http.server $port | Tee-Object -FilePath "logs\server.log"
        $serverStarted = $true
    } 
    catch {
        Write-Host "Python not found or failed" -ForegroundColor Red
        
        # Try Python3
        try {
            $pythonVersion = python3 --version
            Write-Host "Python3 found: $pythonVersion" -ForegroundColor Green
            Write-Host "Starting simple server on http://localhost:$port" -ForegroundColor Green
            Start-Process "http://localhost:$port"
            python3 -m http.server $port | Tee-Object -FilePath "logs\server.log"
            $serverStarted = $true
        } 
        catch {
            Write-Host "Python3 not found or failed" -ForegroundColor Red
        }
    }
}

# If no server could be started
if (!$serverStarted) {
    Write-Host "=====================================================" -ForegroundColor Red
    Write-Host "ERROR: No server software found on your system." -ForegroundColor Red
    Write-Host "=====================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "To run this website, you have these options:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Install Node.js (RECOMMENDED):" -ForegroundColor Cyan
    Write-Host "   - Download from: https://nodejs.org/"
    Write-Host "   - Make sure to check 'Add to PATH' during installation"
    Write-Host ""
    Write-Host "2. Install Python:" -ForegroundColor Cyan
    Write-Host "   - Download from: https://www.python.org/downloads/"
    Write-Host "   - Make sure to check 'Add to PATH' during installation"
    Write-Host ""
    Write-Host "3. Open the website manually:" -ForegroundColor Cyan
    Write-Host "   - Navigate to: $(Get-Location)\index.html"
    Write-Host "   - Double-click to open in your browser"
    Write-Host "   (Note: Some features may not work correctly)"
    Write-Host ""
    
    # Offer to open directly
    $openDirect = Read-Host "Would you like to open index.html directly now? (Y/N)"
    if ($openDirect -eq "Y" -or $openDirect -eq "y") {
        Start-Process "$(Get-Location)\index.html"
    }
    
    Read-Host "Press Enter to exit"
}