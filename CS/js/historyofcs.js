function toggleDetails(element) {
            element.classList.toggle('expanded');
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