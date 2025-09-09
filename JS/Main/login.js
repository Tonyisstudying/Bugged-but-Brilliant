// Import the API client
import ApiClient from '../Utils/apiClient.js';

const apiClient = new ApiClient();

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    
    if (!username) {
        showError('Please enter a username');
        return false;
    }

    try {
        // Test if API is available first
        const apiAvailable = await apiClient.testConnection();
        
        if (apiAvailable) {
            console.log('Using API for login');
            const response = await apiClient.post('/login', { username });
            
            if (response.success) {
                // Store session data
                localStorage.setItem('username', username);
                apiClient.updateSessionId(response.sessionId);
                
                if (response.user) {
                    localStorage.setItem('xp', response.user.xp || 0);
                    localStorage.setItem('streak', response.user.streak || 0);
                }
                
                window.location.href = 'home.html';
                return false;
            }
        } else {
            throw new Error('API not available');
        }
        
    } catch (error) {
        console.log('API login failed, using localStorage fallback:', error.message);
        // Fallback to original localStorage method
        localStorage.setItem('username', username);
        window.location.href = 'home.html';
    }
    
    return false;
}

async function logout() {
    const sessionId = localStorage.getItem('sessionId');
    
    if (sessionId) {
        try {
            await apiClient.post('/logout', { sessionId });
            console.log('Logged out via API');
        } catch (error) {
            console.log('API logout failed:', error.message);
        }
    }
    
    // Always clear localStorage
    localStorage.clear();
    apiClient.updateSessionId(null);
    window.location.href = 'login.html';
}

function showError(message) {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
        document.querySelector('form').appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function checkAuth() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
    }
    return username;
}

// Auto-redirect if already logged in
if (window.location.pathname.includes('login.html')) {
    const username = localStorage.getItem('username');
    if (username) {
        window.location.href = 'home.html';
    }
}