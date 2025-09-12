document.addEventListener('DOMContentLoaded', function() {
    const mainTitle = document.querySelector('.main-title');
    const titleContainer = document.querySelector('.title-container');
    const mainContent = document.querySelector('.main-content');
    
    setTimeout(() => {
        mainTitle.classList.add('active');
    }, 500);
    
    let titleAnimationComplete = false;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 100) {
            titleContainer.classList.add('scrolled');
            mainTitle.classList.add('scrolled');
            
            if (!titleAnimationComplete && scrollPosition > 300) {
                mainContent.classList.add('visible');
                titleAnimationComplete = true;
            }
        } else {
            titleContainer.classList.remove('scrolled');
            mainTitle.classList.remove('scrolled');
        }
    });
    
    // Animation for algorithm boxes
    const algoBoxes = document.querySelectorAll('.algo-box');
    algoBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    const icon = document.querySelector('.central-icon img');
    if (icon) {
        icon.onerror = function() {
            this.src = 'https://img.icons8.com/ios-filled/100/ffffff/flow-chart.png';
        };
    }
});

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