//authentication and validation

// Middleware for logging API requests
const logRequests = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    const sessionId = req.body.sessionId || req.query.sessionId;
    
    if (!sessionId) {
        return res.status(401).json({ error: 'Session ID required' });
    }
    
    // This will be implemented when we connect to the routes
    req.sessionId = sessionId;
    next();
};

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err.message);
    res.status(500).json({ 
        error: 'Internal Server Error',
        details: err.message 
    });
};

module.exports = {
    logRequests,
    requireAuth,
    errorHandler
};