// Middleware for logging API requests
const logRequests = (req, res, next) => {
    console.log(`🌐 ${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
    next();
};

// Middleware to check if user is authenticated
const requireAuth = (sessions) => {
    return (req, res, next) => {
        const sessionId = req.body.sessionId || req.query.sessionId;
        
        if (!sessionId) {
            return res.status(401).json({ error: 'Session ID required' });
        }
        
        if (!sessions[sessionId]) {
            return res.status(401).json({ error: 'Invalid session' });
        }
        
        req.sessionId = sessionId;
        req.username = sessions[sessionId];
        next();
    };
};

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
    console.error('❌ API Error:', err.message);
    res.status(500).json({ 
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = {
    logRequests,
    requireAuth,
    errorHandler
};