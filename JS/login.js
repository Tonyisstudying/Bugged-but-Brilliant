function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    
    if (username) {
        localStorage.setItem('username', username);
        window.location.href = '/pages/home.html';
    }
    return false;
}
// logout
function logout() {
    localStorage.removeItem('username');
    window.location.href = '/pages/login.html';
}

function checkAuth() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/pages/login.html';
    }
    return username;
}

// If we're on the login page and already logged in, redirect to home
if (window.location.pathname.includes('login.html')) {
    const username = localStorage.getItem('username');
    if (username) {
        window.location.href = '/pages/home.html';
    }
}
