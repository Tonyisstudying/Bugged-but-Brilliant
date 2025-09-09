import ApiClient from './Utils/apiClient.js';

const apiClient = new ApiClient();

document.addEventListener('DOMContentLoaded', async function() {
    // Get username from localStorage
    const username = localStorage.getItem('username');
    const sessionId = localStorage.getItem('sessionId');
    
    // Update the username display
    const usernameDisplay = document.getElementById('username-display');
    if (username) {
        usernameDisplay.textContent = `Username: ${username}`;
    } else {
        usernameDisplay.textContent = 'Username: Not logged in';
        window.location.href = 'login.html';
        return;
    }
    
    // Try to load data from server if session exists
    if (sessionId) {
        try {
            // Load user profile
            const profile = await apiClient.get('/profile');
            if (profile) {
                updateXpDisplay(profile.xp || 0);
                updateStreak(profile.streak || 0);
                localStorage.setItem('xp', profile.xp || 0);
                localStorage.setItem('streak', profile.streak || 0);
            }
            
            // Load settings
            const settingsResponse = await apiClient.get('/settings');
            if (settingsResponse.settings) {
                applySettings(settingsResponse.settings);
            }
            
            console.log('🟢 Settings loaded from server');
        } catch (error) {
            console.log('🔴 Failed to load from server, using localStorage:', error.message);
            // Continue with localStorage values
            let xp = parseInt(localStorage.getItem('xp')) || 650;
            let streak = parseInt(localStorage.getItem('streak')) || 3;
            updateXpDisplay(xp);
            updateStreak(streak);
        }
    } else {
        // No session, use localStorage
        let xp = parseInt(localStorage.getItem('xp')) || 650;
        let streak = parseInt(localStorage.getItem('streak')) || 3;
        updateXpDisplay(xp);
        updateStreak(streak);
    }
    
    // Connect logout button
    const logoutButton = document.querySelector('.logout button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
        });
    }
});

// Sidebar navigation (keep existing functionality)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        const target = this.getAttribute('data-section');
        document.querySelectorAll('.settings-page').forEach(page => (page.style.display = 'none'));
        const targetElement = document.getElementById(target);
        if (targetElement) {
            targetElement.style.display = 'block';
        }
    });
});

// Enhanced toggle switches with server sync
document.querySelectorAll('.toggle-switch input').forEach(switchInput => {
    switchInput.addEventListener('change', async function () {
        const settingType = this.closest('.setting-item').querySelector('h3').textContent;
        const isEnabled = this.checked;
        
        console.log(`⚙️ Setting "${settingType}" changed to: ${isEnabled ? 'on' : 'off'}`);
        
        // Save to server if session exists
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await apiClient.post('/settings', {
                    settings: {
                        [settingType]: isEnabled
                    }
                });
                console.log('🟢 Setting saved to server');
            } catch (error) {
                console.log('🔴 Failed to save setting to server:', error.message);
            }
        }
    });
});

// Enhanced theme selector with server sync
document.querySelectorAll('.theme-option').forEach(themeOption => {
    themeOption.addEventListener('click', async function () {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const isDark = this.classList.contains('theme-dark');
        applyTheme(isDark);
        
        // Save theme preference to server
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await apiClient.post('/settings', {
                    settings: {
                        theme: isDark ? 'dark' : 'light'
                    }
                });
                console.log('🟢 Theme saved to server');
            } catch (error) {
                console.log('🔴 Failed to save theme to server:', error.message);
            }
        }
    });
});

// Apply theme function (keep existing)
function applyTheme(isDark) {
    if (isDark) {
        document.body.style.background = '#1a1a1a';
        const container = document.querySelector('.settings-container');
        if (container) {
            container.style.background = 'transparent';
            container.style.borderRadius = '0';
            container.style.boxShadow = 'none';
        }
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.color = '#f5f5f5';
        }
        
        document.querySelectorAll('.settings-section h2').forEach(h2 => (h2.style.color = '#FFAFCC'));
        document.querySelectorAll('.setting-info h3').forEach(h3 => (h3.style.color = '#f5f5f5'));
        document.querySelectorAll('.setting-info p').forEach(p => (p.style.color = '#ccc'));
    } else {
        document.body.style.background = 'linear-gradient(135deg, #FFC8DD 0%, #A2D2FF 100%)';
        
        const container = document.querySelector('.settings-container');
        if (container) {
            container.style.background = 'rgba(255,255,255,0.9)';
            container.style.borderRadius = '20px';
            container.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        }
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.color = '#333';
        }
        
        document.querySelectorAll('.settings-section h2').forEach(h2 => (h2.style.color = '#FFAFCC'));
        document.querySelectorAll('.setting-info h3').forEach(h3 => (h3.style.color = '#444'));
        document.querySelectorAll('.setting-info p').forEach(p => (p.style.color = '#777'));
    }
}

// Apply settings from server response
function applySettings(settings) {
    if (settings.theme) {
        const isDark = settings.theme === 'dark';
        applyTheme(isDark);
        
        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        const selector = isDark ? '.theme-dark' : '.theme-light';
        const activeTheme = document.querySelector(selector);
        if (activeTheme) {
            activeTheme.classList.add('active');
        }
    }
    
    // Apply other toggle settings
    Object.keys(settings).forEach(key => {
        const value = settings[key];
        if (typeof value === 'boolean') {
            const settingItems = document.querySelectorAll('.setting-item');
            settingItems.forEach(item => {
                const heading = item.querySelector('h3');
                if (heading && heading.textContent === key) {
                    const toggle = item.querySelector('input[type="checkbox"]');
                    if (toggle) {
                        toggle.checked = value;
                    }
                }
            });
        }
    });
}

// Enhanced XP functionality with server sync
function updateXpDisplay(xp) {
    const maxXp = 1000;
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    
    if (xpBar && xpText) {
        const percent = (xp / maxXp) * 100;
        xpBar.style.width = `${percent}%`;
        xpBar.classList.add('animate');
        setTimeout(() => xpBar.classList.remove('animate'), 800);
        xpText.textContent = `${xp} / ${maxXp} XP`;
    }
}

// Enhanced streak functionality
function updateStreak(days) {
    const streakText = document.getElementById('streak-text');
    if (streakText) {
        streakText.textContent = `${days}-day streak`;
    }
    
    const streakContainer = document.getElementById('streak-container');
    if (!streakContainer) return;
    
    streakContainer.innerHTML = '';
    
    for (let i = 0; i < Math.min(days, 5); i++) {
        const day = document.createElement('span');
        day.classList.add('streak-day');
        day.title = `Day ${i + 1}`;
        day.textContent = '🔥';
        streakContainer.appendChild(day);
    }
    
    for (let i = days; i < 5; i++) {
        const day = document.createElement('span');
        day.classList.add('streak-day', 'inactive');
        day.title = `Day ${i + 1}`;
        day.textContent = '❄️';
        streakContainer.appendChild(day);
    }
}

// Enhanced XP click with server sync
const profileImg = document.querySelector('.profile-info img');
if (profileImg) {
    profileImg.addEventListener('click', async () => {
        let xp = parseInt(localStorage.getItem('xp')) || 0;
        xp += 50;
        if (xp > 1000) xp = 1000;
        
        localStorage.setItem('xp', xp);
        updateXpDisplay(xp);
        
        // Sync to server
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                await apiClient.post('/settings', {
                    settings: { xp }
                });
                console.log('🟢 XP updated on server');
            } catch (error) {
                console.log('🔴 Failed to sync XP to server');
            }
        }
    });
}

// Make logout function available globally
window.logout = async function() {
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
};