//Uhm this funtion is to display username on the settings page :>
document.addEventListener('DOMContentLoaded', function() {
    // Get username from localStorage
    const username = localStorage.getItem('username');
    
    // Update the username display
    const usernameDisplay = document.getElementById('username-display');
    if (username) {
        usernameDisplay.textContent = `Username: ${username}`;
    } else {
        usernameDisplay.textContent = 'Username: Not logged in';
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
    
    // Connect logout button
    document.querySelector('.logout button').addEventListener('click', function() {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });
});
// Sidebar navigation
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
    const target = this.getAttribute('data-section');
    document.querySelectorAll('.settings-page').forEach(page => (page.style.display = 'none'));
    document.getElementById(target).style.display = 'block';
  });
});

// Toggle switches
document.querySelectorAll('.toggle-switch input').forEach(switchInput => {
  switchInput.addEventListener('change', function () {
    console.log(`Toggle switched: ${this.checked ? 'on' : 'off'}`);
  });
});

// Theme selector
document.querySelectorAll('.theme-option').forEach(themeOption => {
  themeOption.addEventListener('click', function () {
    document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
    if (this.classList.contains('theme-dark')) {
  document.body.style.background = '#1a1a1a';

  const container = document.querySelector('.settings-container');
  container.style.background = 'transparent';   // no grey box
  container.style.borderRadius = '0';           // no rounded corners
  container.style.boxShadow = 'none';           // no shadow

  document.querySelector('.main-content').style.color = '#f5f5f5';
  document.querySelectorAll('.settings-section h2').forEach(h2 => (h2.style.color = '#FFAFCC'));
  document.querySelectorAll('.setting-info h3').forEach(h3 => (h3.style.color = '#f5f5f5'));
  document.querySelectorAll('.setting-info p').forEach(p => (p.style.color = '#ccc'));
} else {
  document.body.style.background = 'linear-gradient(135deg, #FFC8DD 0%, #A2D2FF 100%)';

  const container = document.querySelector('.settings-container');
  container.style.background = 'rgba(255,255,255,0.9)';
  container.style.borderRadius = '20px';
  container.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';

  document.querySelector('.main-content').style.color = '#333';
  document.querySelectorAll('.settings-section h2').forEach(h2 => (h2.style.color = '#FFAFCC'));
  document.querySelectorAll('.setting-info h3').forEach(h3 => (h3.style.color = '#444'));
  document.querySelectorAll('.setting-info p').forEach(p => (p.style.color = '#777'));
}
  });
});

// XP bar functionality
let xp = 650;
const maxXp = 1000;
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
xpBar.style.width = (xp / maxXp) * 100 + '%';

document.querySelector('.profile-info img').addEventListener('click', () => {
  if (xp < maxXp) xp += 50;
  if (xp > maxXp) xp = maxXp;
  const percent = (xp / maxXp) * 100;
  xpBar.style.width = percent + '%';
  xpBar.classList.add('animate');
  setTimeout(() => xpBar.classList.remove('animate'), 800);
  xpText.textContent = `${xp} / ${maxXp} XP`;
});

// Streak functionality
let streakDays = 3;
function updateStreak(days) {
  streakDays = days > 5 ? 5 : days;
  document.querySelectorAll('.streak-day').forEach((day, index) => {
    if (index < streakDays) {
      day.textContent = '🔥';
      day.classList.remove('inactive');
      day.classList.add('active-fire');
      setTimeout(() => day.classList.remove('active-fire'), 500);
    } else {
      day.textContent = '❄️';
      day.classList.add('inactive');
    }
  });
  document.getElementById('streak-text').textContent = `${streakDays}-day streak`;
}

document.getElementById('streak-container').addEventListener('click', () => {
  updateStreak(streakDays + 1);
  alert('Streak increased!');
});
