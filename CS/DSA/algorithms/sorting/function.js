document.addEventListener('DOMContentLoaded', function() {
    hljs.highlightAll();
    const languageTabs = document.querySelectorAll('.language-tab');
    languageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            document.querySelectorAll('.language-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');
            document.querySelectorAll('.code-block').forEach(block => {
                block.classList.remove('active');
            });
            document.querySelector(`.code-block[data-lang="${lang}"]`).classList.add('active');
        });
    });
    
    // Copy button functionality
    document.querySelector('.editor-buttons button[title="Copy code"]').addEventListener('click', function() {
        const activeCode = document.querySelector('.code-block.active code');
        const textToCopy = activeCode.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalIcon = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalIcon;
            }, 2000);
        });
    });
    
    document.querySelector('.editor-buttons button[title="Run code"]').addEventListener('click', function() {
        alert('Code execution would be handled by a backend service.');
    });
    // Full screen button
    document.querySelector('.editor-buttons button[title="Full screen"]').addEventListener('click', function() {
        const codeEditor = document.querySelector('.code-editor');
        if (!document.fullscreenElement) {
            codeEditor.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
});