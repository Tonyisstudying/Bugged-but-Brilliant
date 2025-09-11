import VocabularyExercise from '../Exercises/vocabulary.js';
import MultipleChoiceExercise from '../Exercises/multiple_choice.js';

class CourseDisplay {
    constructor() {
        this.currentLevel = 1;
        this.currentStage = 1;
        this.currentMode = null;
        this.currentExercise = 'vocabulary'; //track
        this.vocabularyExercise = new VocabularyExercise();
        this.multipleChoiceExercise = new MultipleChoiceExercise();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Ensure elements exist before adding listeners
        const levelTabs = document.querySelectorAll('.level-tab');
        if (levelTabs.length === 0) {
            console.error('No .level-tab elements found');
            return;
        }
        
        levelTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const levelNum = parseInt(e.target.dataset.level);
                if (isNaN(levelNum)) {
                    console.error('Invalid level number');
                    return;
                }
                this.switchLevel(levelNum);
            });
        });

        // Add click handlers for stage circles that aren't locked
        const stageCircles = document.querySelectorAll('.stage-circle:not(.locked)');
        stageCircles.forEach(circle => {
            circle.addEventListener('click', (e) => {
                const level = parseInt(circle.getAttribute('data-level'));
                const stage = parseInt(circle.getAttribute('data-stage'));
                if (isNaN(level) || isNaN(stage)) {
                    console.error('Invalid level or stage number');
                    return;
                }
                this.startStage(level, stage);
            });
        });
        
        // Add click handler to the overlay to close the content when clicked outside
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                // Only close if the click was directly on the overlay (not its children)
                if (e.target === overlay) {
                    this.closeContent();
                }
            });
        }
    }

    switchLevel(level) {
        // Update active tab
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.level-tab[data-level="${level}"]`).classList.add('active');
        
        // Show corresponding path
        document.querySelectorAll('.path-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`level-${level}-path`).classList.remove('hidden');
    }
    
    async startStage(levelNum, stageNum) {
        console.log(`Starting stage ${stageNum} of level ${levelNum}`);
        this.currentLevel = levelNum;
        this.currentStage = stageNum;
        this.currentExercise = 'vocabulary'; // Reset when starting a new stage

        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        // First show the overlay
        if (overlay) {
            overlay.classList.remove('hidden');
            // Force a reflow before adding the visible class for the animation to work
            void overlay.offsetWidth;
            overlay.classList.add('visible');
        }
        
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
            this.completeStage();
        }
    }

    // Method to close the content modal
    closeContent() {
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        if (content) {
            // First remove visible class to trigger fade-out
            content.classList.remove('visible');
            // Also fade out the overlay
            if (overlay) {
                overlay.classList.remove('visible');
            }
            // After animation completes, hide the content
            setTimeout(() => {
                content.classList.add('hidden');
                if (overlay) overlay.classList.add('hidden');
                document.querySelector('.course-title').classList.remove('minimized');
            }, 500); // Match this timing with your CSS transition
        }
    }
    
    completeStage() {
        console.log(`Stage ${this.currentStage} of Level ${this.currentLevel} completed`);
        // Hide lesson content using the closeContent method
        this.closeContent();
        // Restore title
        const title = document.querySelector('.course-title');
        if (title) title.classList.remove('minimized');
        // Update UI to reflect completion
        this.updateStageCompletion();
        // Show completion message
        alert(`Congratulations! You've completed HSK ${this.currentLevel} - Stage ${this.currentStage}`);
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
                // Remove lock icon if present
                const lockIcon = nextStage.querySelector('.lock-icon');
                if (lockIcon) {
                    lockIcon.parentNode.removeChild(lockIcon);
                    // Add star icon
                    const starIcon = document.createElement('div');
                    starIcon.className = 'star-icon';
                    starIcon.innerHTML = '★';
                    nextStage.insertBefore(starIcon, nextStage.firstChild);
                }
                // Add click event for the newly unlocked stage
                const courseDisplay = this;
                nextStage.addEventListener('click', function() {
                    const level = parseInt(this.getAttribute('data-level'));
                    const stage = parseInt(this.getAttribute('data-stage'));
                    courseDisplay.startStage(level, stage);
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