// Toggle details and show image
function toggleDetails(element, imageId) {
    // Toggle expanded class on content
    element.classList.toggle('expanded');
    
    // Toggle image visibility
    const imageContainer = document.getElementById(imageId);
    if (imageContainer) {
        imageContainer.classList.toggle('show');
    }
}

// Add scroll reveal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Existing image placeholder code
    const images = document.querySelectorAll('.era-image');
    images.forEach(img => {
        img.onerror = function() {
            this.src = 'https://placehold.co/600x400?text=Computer+History+Image';
        };
    });
    
    // Add scroll reveal
    const eraElements = document.querySelectorAll('.era');
    
    // Initial check for elements in view on page load
    checkVisibility();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkVisibility);
    
    function checkVisibility() {
        const triggerBottom = window.innerHeight * 0.8;
        
        eraElements.forEach(era => {
            const eraTop = era.getBoundingClientRect().top;
            
            if (eraTop < triggerBottom) {
                era.classList.add('visible');
            }
        });
    }
});