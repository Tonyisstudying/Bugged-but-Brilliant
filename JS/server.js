const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Import API routes and middleware
const apiRoutes = require('./API/routes');
const { logRequests, errorHandler } = require('./API/middleware');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Apply logging middleware only to API routes
app.use('/api', logRequests);

// Use API routes
app.use('/api', apiRoutes);

// Apply error handling middleware
app.use(errorHandler);

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Lexio Server Started Successfully!');
    console.log('='.repeat(50));
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📝 API Test: http://localhost:${PORT}/api/test`);
    console.log('='.repeat(50));
});