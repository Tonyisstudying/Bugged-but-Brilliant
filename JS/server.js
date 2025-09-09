const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Simple in-memory user storage (replace with database in production)
const users = {};

// Simple session management (replace with proper sessions in production)
const sessions = {};

// API endpoint for user registration
app.post('/api/register', (req, res) => {
const { username, password } = req.body;

if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
}

if (users[username]) {
    return res.status(409).json({ error: 'Username already exists' });
}

// Create a new user (in production, password should be hashed)
users[username] = { 
    password,
    progress: {},
    xp: 0,
    streak: 0,
    lastLogin: Date.now()
};

// Create a session
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

// API endpoint for user login
app.post('/api/login', (req, res) => {
const { username, password } = req.body;

if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
}

// Update streak if last login was not today
const today = new Date().setHours(0, 0, 0, 0);
const lastLogin = new Date(users[username].lastLogin).setHours(0, 0, 0, 0);

if (lastLogin < today) {
    if (lastLogin === today - 86400000) { // 24 hours in ms
    users[username].streak += 1;
    } else {
    users[username].streak = 1;
    }
}

users[username].lastLogin = Date.now();

// Create a session
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

// API endpoint for user logout
app.post('/api/logout', (req, res) => {
const { sessionId } = req.body;

if (sessions[sessionId]) {
    delete sessions[sessionId];
}

res.json({ success: true });
});

// API endpoint for course data
app.get('/api/courses/chinese/HSK:level/stage:stage/:type', async (req, res) => {
const { level, stage, type } = req.params;

try {
    // Read the JSON file
    const filePath = path.join(__dirname, '..', 'Json', `HSK${level}`, `stage${stage}`, `${type}.json`);
    const data = await fs.readFile(filePath, 'utf8');
    res.json(JSON.parse(data));
} catch (error) {
    console.error('Error reading course data:', error);
    res.status(404).json({ error: `Failed to load ${type} data for HSK${level} stage${stage}` });
}
});

// API endpoint for saving user progress
app.post('/api/progress', (req, res) => {
const { sessionId, course, level, stage, exerciseId, score } = req.body;

// Check if user is authenticated
const username = sessions[sessionId];
if (!username || !users[username]) {
    return res.status(401).json({ error: 'User not authenticated' });
}

// Initialize progress structure if it doesn't exist
if (!users[username].progress[course]) {
    users[username].progress[course] = {};
}
if (!users[username].progress[course][`HSK${level}`]) {
    users[username].progress[course][`HSK${level}`] = {};
}
if (!users[username].progress[course][`HSK${level}`][`stage${stage}`]) {
    users[username].progress[course][`HSK${level}`][`stage${stage}`] = {};
}

// Save the progress
users[username].progress[course][`HSK${level}`][`stage${stage}`][exerciseId] = score;

// Award XP
users[username].xp += 10;

res.json({ 
    success: true,
    xp: users[username].xp,
    streak: users[username].streak
});
});

// API endpoint for getting user progress
app.get('/api/progress', (req, res) => {
const { sessionId, course, level, stage } = req.query;

// Check if user is authenticated
const username = sessions[sessionId];
if (!username || !users[username]) {
    return res.status(401).json({ error: 'User not authenticated' });
}

// Get the requested progress
const progress = users[username].progress[course]?.[`HSK${level}`]?.[`stage${stage}`] || {};

res.json({ progress });
});

// API endpoint for getting user profile
app.get('/api/profile', (req, res) => {
const { sessionId } = req.query;

// Check if user is authenticated
const username = sessions[sessionId];
if (!username || !users[username]) {
    return res.status(401).json({ error: 'User not authenticated' });
}

res.json({
    username,
    xp: users[username].xp,
    streak: users[username].streak,
    lastLogin: users[username].lastLogin
});
});

// Fallback route for SPA
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});