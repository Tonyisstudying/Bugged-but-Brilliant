//start Express and mount routes
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from root directory
app.use(express.static(path.join(__dirname, '..')));

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '../index.html'));
});

// Handle login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', '../login.html'));
});

// Handle home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', '../home.html'));
});

// Handle about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'About us', '../about.html'));
});

// Handle settings page
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', '../settings.html'));
});

// Handle course pages
app.get('/course_chinese', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', '../course_chinese.html'));
});

app.get('/course_firstpage', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', '../course_firstpage.html'));
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', '../index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Open your browser and go to: http://localhost:${port}`);
});