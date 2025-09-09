//API endpoint definitions



const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// In-memory storage (will move to database later)
const users = {};
const sessions = {};

// Test endpoint to verify API is working
router.get('/test', (req, res) => {
    res.json({ 
        message: 'API is working!', 
        timestamp: new Date().toISOString() 
    });
});

// Simple login endpoint (compatible with your existing system)
router.post('/login', (req, res) => {
    const { username } = req.body;
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    
    // Create or update user
    if (!users[username]) {
        users[username] = {
            username,
            progress: {},
            xp: 0,
            streak: 0,
            lastLogin: Date.now()
        };
        console.log(`New user created: ${username}`);
    } else {
        users[username].lastLogin = Date.now();
        console.log(`User logged in: ${username}`);
    }
    
    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15);
    sessions[sessionId] = username;
    
    res.json({
        success: true,
        sessionId,
        user: {
            username,
            xp: users[username].xp,
            streak: users[username].streak
        }
    });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    const { sessionId } = req.body;
    
    if (sessions[sessionId]) {
        console.log(`User logged out: ${sessions[sessionId]}`);
        delete sessions[sessionId];
    }
    
    res.json({ success: true });
});

// Get course data (serves your existing JSON files)
router.get('/courses', async (req, res) => {
    const { language, level, stage, type } = req.query;
    
    if (!language || !level || !stage || !type) {
        return res.status(400).json({ 
            error: 'Missing parameters. Required: language, level, stage, type' 
        });
    }
    
    try {
        const levelNum = level.replace('HSK', '');
        const filePath = path.join(__dirname, '..', '..', 'Json', `HSK${levelNum}`, `stage${stage}`, `${type}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        
        console.log(`Served course data: HSK${levelNum}/stage${stage}/${type}`);
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading course data:', error.message);
        res.status(404).json({ 
            error: `Could not load ${type} data for HSK${level} stage${stage}` 
        });
    }
});

module.exports = router;