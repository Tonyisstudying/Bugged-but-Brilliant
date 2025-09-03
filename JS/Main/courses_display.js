import VocabularyExercise from '../Exercises/vocabulary.js';
import MultipleChoiceExercise from '../Exercises/multiple_choice.js';

class CourseDisplay {
    constructor() {
        this.currentLevel = 1;
        this.currentStage = 1;
        this.currentExercise = 'vocabulary'; //track
        this.vocabularyExercise = new VocabularyExercise();
        this.multipleChoiceExercise = new MultipleChoiceExercise();
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
        this.currentExercise = 'vocabulary'; //reset when starting a new level

        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        
        if (title) title.classList.add('minimized');
        if (content) content.classList.remove('hidden');
        
        // Start with vocabulary exercise
        await this.vocabularyExercise.display(this.currentLevel, this.currentStage);
    }
    async nextExercise() {
        if (this.currentExercise === 'vocabulary') {
            this.currentExercise = 'multipleChoice';
            await this.multipleChoiceExercise.display(this.currentLevel, this.currentStage);
        } else {
            // Handle completion of all exercises
            this.completeLevel();
        }
    }

    completeLevel() {
        console.log('Level completed');
        // You can add logic here to show completion message or move to next level
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CourseDisplay');
    window.courseDisplay = new CourseDisplay();
});