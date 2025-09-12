const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..')));

// Serve your existing static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Fallback route for SPA
app.get('*', (req, res) => {
    // Serve the main HTML file
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('🚀'.repeat(20));
    console.log('🎉 Lexio Server Started Successfully!');
    console.log('🚀'.repeat(20));
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log('🚀'.repeat(20));
});