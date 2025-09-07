document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to category headers
    const categories = document.querySelectorAll('.algo-category');
    categories.forEach(category => {
        const header = category.querySelector('.category-header');
        const content = category.querySelector('.category-content');
        
        // Skip if no content section
        if (!content) return;
        
        // Initially hide all content sections
        content.style.display = 'none';
        
        // Toggle content when header is clicked
        header.addEventListener('click', function(e) {
            // Don't toggle if clicking the see more button
            if (e.target.classList.contains('see-more-btn')) return;
            
            // Toggle display
            if (content.style.display === 'none') {
                content.style.display = 'block';
                
                // Add animation class
                content.classList.add('fade-in');
                
                // Scroll to the category
                setTimeout(() => {
                    category.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            } else {
                content.style.display = 'none';
            }
        });
    });
    
    // Animation for algorithm boxes
    const algoBoxes = document.querySelectorAll('.algo-box');
    algoBoxes.forEach((box, index) => {
        // Add delay for staggered animation
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Add algorithm icon if missing
    const icon = document.querySelector('.central-icon img');
    if (icon) {
        icon.onerror = function() {
            this.src = 'https://img.icons8.com/ios-filled/100/ffffff/flow-chart.png';
        };
    }
});

// Helper function to animate number counters
function animateCounter(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value;
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .algo-box {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);