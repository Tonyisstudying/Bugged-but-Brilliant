const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '../index.html'));
});

// Handle login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Login page', '../pages/login.html'));
});

// Handle home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Homepage', '../pages/home.html'));
});

// Handle about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'About us', '../pages/about-us.html'));
});

// Handle settings page
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Setting', '../pages/setting.html'));
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', '../index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
