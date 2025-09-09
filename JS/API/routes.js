const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// In-memory storage for users and sessions (temporary solution)
const users = {};
const sessions = {};

// Test endpoint to verify API is working
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Lexio API is working!', 
        timestamp: new Date().toISOString(),
        status: 'success'
    });
});

// Enhanced login endpoint (compatible with your existing login system)
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
            lastLogin: Date.now(),
            settings: {},
            createdAt: Date.now()
        };
        console.log(`✅ New user created: ${username}`);
    } else {
        // Update streak logic
        const today = new Date().setHours(0, 0, 0, 0);
        const lastLogin = new Date(users[username].lastLogin).setHours(0, 0, 0, 0);
        
        if (lastLogin < today) {
            if (lastLogin === today - 86400000) { // Yesterday
                users[username].streak += 1;
            } else {
                users[username].streak = 1;
            }
        }
        users[username].lastLogin = Date.now();
        console.log(`✅ User logged in: ${username} (streak: ${users[username].streak})`);
    }
    
    // Create session
    const sessionId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
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
        console.log(`👋 User logged out: ${sessions[sessionId]}`);
        delete sessions[sessionId];
    }
    
    res.json({ success: true });
});

// Enhanced course data endpoint (serves your existing JSON files)
router.get('/courses/chinese/HSK:level/stage:stage/:type', async (req, res) => {
    const { level, stage, type } = req.params;
    
    try {
        const filePath = path.join(__dirname, '..', '..', 'Json', `HSK${level}`, `stage${stage}`, `${type}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        
        console.log(`📚 Served course data: HSK${level}/stage${stage}/${type}`);
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(`❌ Error reading course data: ${error.message}`);
        res.status(404).json({ 
            error: `Could not load ${type} data for HSK${level} stage${stage}`,
            details: error.message
        });
    }
});

// Progress tracking endpoints
router.post('/progress', (req, res) => {
    const { sessionId, course, level, stage, exerciseId, score } = req.body;
    const username = sessions[sessionId];
    
    if (!username || !users[username]) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Initialize progress structure
    if (!users[username].progress[course]) {
        users[username].progress[course] = {};
    }
    if (!users[username].progress[course][`HSK${level}`]) {
        users[username].progress[course][`HSK${level}`] = {};
    }
    if (!users[username].progress[course][`HSK${level}`][`stage${stage}`]) {
        users[username].progress[course][`HSK${level}`][`stage${stage}`] = {};
    }
    
    // Save progress and award XP
    users[username].progress[course][`HSK${level}`][`stage${stage}`][exerciseId] = score;
    users[username].xp += 10;
    
    console.log(`📈 Progress saved for ${username}: HSK${level}/stage${stage}/${exerciseId} = ${score}% (+10 XP)`);
    
    res.json({
        success: true,
        xp: users[username].xp,
        streak: users[username].streak
    });
});

router.get('/progress', (req, res) => {
    const { sessionId, course, level, stage } = req.query;
    const username = sessions[sessionId];
    
    if (!username || !users[username]) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const progress = users[username].progress[course]?.[`HSK${level}`]?.[`stage${stage}`] || {};
    res.json({ progress });
});

// User profile endpoint
router.get('/profile', (req, res) => {
    const { sessionId } = req.query;
    const username = sessions[sessionId];
    
    if (!username || !users[username]) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    res.json({
        username,
        xp: users[username].xp,
        streak: users[username].streak,
        lastLogin: users[username].lastLogin,
        createdAt: users[username].createdAt
    });
});

// Settings endpoints
router.post('/settings', (req, res) => {
    const { sessionId, settings } = req.body;
    const username = sessions[sessionId];
    
    if (!username || !users[username]) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    users[username].settings = { ...users[username].settings, ...settings };
    console.log(`⚙️ Settings updated for ${username}:`, settings);
    
    res.json({ success: true });
});

router.get('/settings', (req, res) => {
    const { sessionId } = req.query;
    const username = sessions[sessionId];
    
    if (!username || !users[username]) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    res.json({ settings: users[username].settings || {} });
});

// Statistics endpoint (for debugging)
router.get('/stats', (req, res) => {
    res.json({
        totalUsers: Object.keys(users).length,
        activeSessions: Object.keys(sessions).length,
        users: Object.keys(users),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;