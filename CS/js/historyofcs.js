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

// Add placeholder images if actual ones aren't available
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.era-image');
    images.forEach(img => {
        img.onerror = function() {
            this.src = 'https://placehold.co/600x400?text=Computer+History+Image';
        };
    });
});