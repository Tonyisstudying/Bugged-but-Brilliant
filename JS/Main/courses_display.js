import VocabularyExercise from '../Exercises/vocabulary.js';

class CourseDisplay {
    constructor() {
        this.currentLevel = 1;
        this.currentStage = 1;
        this.vocabularyExercise = new VocabularyExercise();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Ensure elements exist before adding listeners
        const levels = document.querySelectorAll('.level');
        if (levels.length === 0) {
            console.error('No .level elements found');
            return;
        }
        
        levels.forEach(level => {
            level.addEventListener('click', async (e) => {
                const levelNum = parseInt(e.target.dataset.level);
                if (isNaN(levelNum)) {
                    console.error('Invalid level number');
                    return;
                }
                await this.startLevel(levelNum);
            });
        });
    }

    async startLevel(levelNum) {
        this.currentLevel = levelNum;
        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        
        if (title) title.classList.add('minimized');
        if (content) content.classList.remove('hidden');
        
        // Start with vocabulary exercise
        await this.vocabularyExercise.display(this.currentLevel, this.currentStage);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CourseDisplay');
    new CourseDisplay();
});