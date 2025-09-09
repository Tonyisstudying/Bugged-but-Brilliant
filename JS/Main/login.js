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
        // Show loading state
        showLoading(true);
        
        // Test if API is available first
        const apiAvailable = await apiClient.testConnection();
        
        if (apiAvailable) {
            console.log('🟢 Using API for login');
            const response = await apiClient.post('/login', { username });
            
            if (response.success) {
                // Store session data
                localStorage.setItem('username', username);
                apiClient.updateSessionId(response.sessionId);
                
                if (response.user) {
                    localStorage.setItem('xp', response.user.xp || 0);
                    localStorage.setItem('streak', response.user.streak || 0);
                }
                
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
                return false;
            }
        } else {
            throw new Error('API not available');
        }
        
    } catch (error) {
        console.log('🔴 API login failed, using localStorage fallback:', error.message);
        // Fallback to original localStorage method
        localStorage.setItem('username', username);
        showSuccess('Login successful (offline mode)! Redirecting...');
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
    } finally {
        showLoading(false);
    }
    
    return false;
}

async function logout() {
    const sessionId = localStorage.getItem('sessionId');
    
    if (sessionId) {
        try {
            await apiClient.post('/logout', { sessionId });
            console.log('🟢 Logged out via API');
        } catch (error) {
            console.log('🔴 API logout failed:', error.message);
        }
    }
    
    // Always clear localStorage
    localStorage.clear();
    apiClient.updateSessionId(null);
    window.location.href = 'login.html';
}

function showError(message) {
    showMessage(message, 'error');
}

function showSuccess(message) {
    showMessage(message, 'success');
}

function showLoading(isLoading) {
    const button = document.querySelector('.start-button');
    if (button) {
        if (isLoading) {
            button.textContent = 'Connecting...';
            button.disabled = true;
        } else {
            button.textContent = 'Start';
            button.disabled = false;
        }
    }
}

function showMessage(message, type) {
    let messageDiv = document.getElementById('login-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'login-message';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.padding = '10px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.textAlign = 'center';
        document.querySelector('form').appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = type;
    
    if (type === 'error') {
        messageDiv.style.backgroundColor = '#ffebee';
        messageDiv.style.color = '#c62828';
        messageDiv.style.border = '1px solid #ef5350';
    } else if (type === 'success') {
        messageDiv.style.backgroundColor = '#e8f5e8';
        messageDiv.style.color = '#2e7d32';
        messageDiv.style.border = '1px solid #4caf50';
    }
    
    // Clear message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
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

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
    
    // Test API connection
    console.log('🔄 Testing API connection...');
    apiClient.testConnection().then(isOnline => {
        if (isOnline) {
            console.log('🟢 Backend is available - enhanced features enabled');
        } else {
            console.log('🟡 Backend not available - running in offline mode');
        }
    });
});

// Make functions globally available
window.handleLogin = handleLogin;
window.logout = logout;
window.checkAuth = checkAuth;
window.apiClient = apiClient;