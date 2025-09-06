#!/bin/bash
# Lexio Launcher for macOS/Linux

echo "====================================================="
echo "       Launching Lexio Language Learning Platform"
echo "====================================================="
echo

# Create logs directory
mkdir -p logs

# Try Node.js first
if command -v node &> /dev/null; then
    echo "Node.js found! Starting server..."
    
    # Check if packages are installed
    if [ ! -d "node_modules" ]; then
        echo "Installing required packages..."
        npm install
        if [ $? -ne 0 ]; then
            echo "ERROR: Failed to install packages"
            SERVER_STARTED=false
        fi
    fi
    
    # Start Node.js server
    PORT=3000
    echo "Starting server on http://localhost:$PORT"
    if [ "$(uname)" == "Darwin" ]; then
        open "http://localhost:$PORT"
    else
        xdg-open "http://localhost:$PORT" &> /dev/null || true
    fi
    node JS/server.js > logs/server.log 2>&1
    SERVER_STARTED=true
else
    # Try Python
    if command -v python3 &> /dev/null; then
        echo "Python3 found! Starting simple server..."
        PORT=8000
        echo "Starting server on http://localhost:$PORT"
        if [ "$(uname)" == "Darwin" ]; then
            open "http://localhost:$PORT"
        else
            xdg-open "http://localhost:$PORT" &> /dev/null || true
        fi
        python3 -m http.server $PORT > logs/server.log 2>&1
        SERVER_STARTED=true
    elif command -v python &> /dev/null; then
        echo "Python found! Starting simple server..."
        PORT=8000
        echo "Starting server on http://localhost:$PORT"
        if [ "$(uname)" == "Darwin" ]; then
            open "http://localhost:$PORT"
        else
            xdg-open "http://localhost:$PORT" &> /dev/null || true
        fi
        python -m http.server $PORT > logs/server.log 2>&1
        SERVER_STARTED=true
    else
        echo "====================================================="
        echo "ERROR: No server software found on your system."
        echo "====================================================="
        echo
        echo "To run this website, you have these options:"
        echo
        echo "1. Install Node.js (RECOMMENDED):"
        echo "   - Download from: https://nodejs.org/"
        echo
        echo "2. Install Python:"
        echo "   - Download from: https://www.python.org/downloads/"
        echo
        echo "3. Open the website manually:"
        echo "   - Navigate to: $(pwd)/index.html"
        echo "   - Double-click to open in your browser"
        echo "   (Note: Some features may not work correctly)"
        echo
        
        # Offer to open directly
        read -p "Would you like to open index.html directly now? (Y/N): " OPEN_DIRECT
        if [[ $OPEN_DIRECT == [Yy]* ]]; then
            if [ "$(uname)" == "Darwin" ]; then
                open "index.html"
            else
                xdg-open "index.html" &> /dev/null || true
            fi
        fi
    fi
fi

echo
echo "If the website didn't open automatically, go to:"
echo "http://localhost:$PORT"
echo
echo "Check logs/server.log if you encounter any issues."
echo