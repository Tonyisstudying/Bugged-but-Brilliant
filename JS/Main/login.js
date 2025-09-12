function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = '../pages/home.html';
    }
    return false;
}

function logout() {
    // Clear localStorage
    localStorage.clear();
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
            button.textContent = 'Logging in...';
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
        window.location.href = '../pages/login.html';
    }
    return username;
}

// Auto-redirect if already logged in
if (window.location.pathname.includes('login.html')) {
    const username = localStorage.getItem('username');
    if (username) {
        window.location.href = '../pages/home.html';
    }
}

// Add event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
});

// Make functions globally available
window.handleLogin = handleLogin;
window.logout = logout;
window.checkAuth = checkAuth;