document.addEventListener('DOMContentLoaded', function() {
    // Main title animation
    const mainTitle = document.querySelector('.main-title');
    
    // Show the title with animation
    setTimeout(() => {
        mainTitle.classList.add('active');
    }, 500);
    
    // Variables to track scroll position
    let lastScrollTop = 0;
    let circlesVisible = false;
    let learnVisible = false;
    
    // Elements to animate on scroll
    const circlesSection = document.getElementById('circles-section');
    const learnSection = document.getElementById('learn-section');
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        let scrollPosition = window.scrollY;
        
        // Title transformation
        if (scrollPosition > 100) {
            mainTitle.classList.add('scrolled');
        } else {
            mainTitle.classList.remove('scrolled');
        }
        
        // Animate circles section when scrolled into view
        if (scrollPosition > window.innerHeight * 0.5 && !circlesVisible) {
            circlesSection.classList.add('visible');
            circlesVisible = true;
        }
        
        // Animate learn section when scrolled into view
        if (scrollPosition > window.innerHeight * 1.2 && !learnVisible) {
            learnSection.classList.add('visible');
            learnVisible = true;
        }
        
        lastScrollTop = scrollPosition;
    });
    
    // Handle clicks on circles
    document.getElementById('data-structure-circle').addEventListener('click', function() {
        window.location.href = 'DSA/data-structures.html';
    });
    
    document.getElementById('algorithm-circle').addEventListener('click', function() {
        window.location.href = 'DSA/algorithms.html';
    });
});Z