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

    async startStage(levelNum, stageNum) {
        this.currentLevel = levelNum;
        this.currentStage = stageNum;
        this.currentExercise = 'vocabulary'; // Reset when starting a new stage

        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        
        if (title) title.classList.add('minimized');
        if (content) {
        content.classList.remove('hidden');
        
        // Add short delay before adding visible class for animation
        setTimeout(() => {
            content.classList.add('visible');
        }, 50);
        }
        
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

    completeStage() {
        console.log(`Stage ${this.currentStage} of Level ${this.currentLevel} completed`);
        
        // Hide lesson content
        const content = document.getElementById('lesson-content');
        if (content) content.classList.add('hidden');
        
        // Restore title
        const title = document.querySelector('.course-title');
        if (title) title.classList.remove('minimized');
        
        // Update UI to reflect completion
        this.updateStageCompletion();
    }

    updateStageCompletion() {
        // Find the completed stage circle and mark it as complete
        const completedStage = document.querySelector(`.stage-circle[data-level="${this.currentLevel}"][data-stage="${this.currentStage}"]`);
        if (completedStage) {
            completedStage.classList.add('completed');
            
            // Unlock the next stage if it exists
            const nextStage = document.querySelector(`.stage-circle[data-level="${this.currentLevel}"][data-stage="${this.currentStage + 1}"]`);
            if (nextStage) {
                nextStage.classList.remove('locked');
                // Add click event for the newly unlocked stage
                nextStage.addEventListener('click', function() {
                    const level = this.getAttribute('data-level');
                    const stage = this.getAttribute('data-stage');
                    
                    document.getElementById('preview-stage-number').textContent = stage;
                    document.getElementById('overlay').classList.remove('hidden');
                    document.getElementById('stage-preview').classList.remove('hidden');
                    document.getElementById('start-lesson-btn').setAttribute('data-level', level);
                    document.getElementById('start-lesson-btn').setAttribute('data-stage', stage);
                });
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CourseDisplay');
    window.courseDisplay = new CourseDisplay();
});