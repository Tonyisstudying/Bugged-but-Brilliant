function showContent(contentType) {
    // Hide choice section
    document.querySelector('.choice-section').style.display = 'none';
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected content section
    document.getElementById(contentType + '-content').style.display = 'block';
    
    // Scroll to the top of the content
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showChoiceSection() {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide all detail contents
    document.querySelectorAll('.detail-content').forEach(detail => {
        detail.style.display = 'none';
    });
    
    // Show choice section
    document.querySelector('.choice-section').style.display = 'block';
    
    // Scroll to choice section
    document.querySelector('.choice-section').scrollIntoView({
        behavior: 'smooth'
    });
}

function toggleDetail(detailId) {
    // Hide all detail contents
    document.querySelectorAll('.detail-content').forEach(detail => {
        if (detail.id !== detailId) {
            detail.style.display = 'none';
        }
    });
    
    // Toggle the selected detail content
    const detailContent = document.getElementById(detailId);
    if (detailContent.style.display === 'block') {
        detailContent.style.display = 'none';
    } else {
        detailContent.style.display = 'block';
        detailContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}