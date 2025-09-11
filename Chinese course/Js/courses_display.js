import VocabularyExercise from './Exercises/vocabulary.js';
import MultipleChoiceExercise from './Exercises/multiple_choice.js';

class CourseDisplay {
    constructor() {
        this.currentLevel = 1;
        this.currentStage = 1;
        this.currentMode = null;
        this.vocabularyExercise = new VocabularyExercise();
        this.multipleChoiceExercise = new MultipleChoiceExercise();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Level card listeners (replacing level tabs)
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const levelNum = parseInt(e.currentTarget.dataset.level);
                this.showCategorySelection(levelNum);
            });
        });

        // Modal close listeners
        this.setupModalListeners();
    }

    setupModalListeners() {
        // Close category modal
        document.getElementById('close-category')?.addEventListener('click', () => {
            this.hideModal('category-modal');
        });

        // Close words modal
        document.getElementById('close-words')?.addEventListener('click', () => {
            this.hideModal('words-modal');
        });

        // Close stages modal
        document.getElementById('close-stages')?.addEventListener('click', () => {
            this.hideModal('stages-modal');
        });

        // Close word detail modal
        document.getElementById('close-word-detail')?.addEventListener('click', () => {
            this.hideModal('word-detail-modal');
        });

        // Close on overlay click
        document.getElementById('overlay')?.addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAllModals();
            }
        });
    }

    async showCategorySelection(level) {
        this.currentLevel = level;
        
        // Update title
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = `Choose Learning Mode - HSK ${level}`;
        }

        // Add click listeners to category cards
        this.setupCategoryListeners();
        
        this.showModal('category-modal');
    }

    setupCategoryListeners() {
        document.querySelectorAll('.category-card').forEach(card => {
            // Remove existing listeners
            card.replaceWith(card.cloneNode(true));
        });

        // Re-attach listeners to fresh elements
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = card.dataset.category;
                this.openCategory(categoryId);
            });
        });
    }

    async openCategory(categoryId) {
        this.currentMode = categoryId;
        this.hideModal('category-modal');

        if (categoryId === 'words') {
            await this.showAllWords();
        } else if (categoryId === 'quiz') {
            await this.showQuizStages();
        }
    }

    async showAllWords() {
        try {
            // Load words from all stages for the current level
            const allWords = [];
            const stages = [1, 2, 3, 4]; // Adjust based on available stages

            for (const stage of stages) {
                try {
                    const response = await fetch(`../Json/HSK${this.currentLevel}/stage${stage}/words.json`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.words) {
                            allWords.push(...data.words);
                        }
                    }
                } catch (error) {
                    console.log(`Stage ${stage} not available for HSK${this.currentLevel}`);
                }
            }

            // Update title
            const wordsTitle = document.getElementById('words-title');
            if (wordsTitle) {
                wordsTitle.textContent = `HSK ${this.currentLevel} - Vocabulary (${allWords.length} words)`;
            }

            this.renderWordCards(allWords);
            this.showModal('words-modal');
        } catch (error) {
            console.error('Error loading words:', error);
            alert('Failed to load vocabulary data');
        }
    }

    async showQuizStages() {
        // Update title
        const stagesTitle = document.getElementById('stages-title');
        if (stagesTitle) {
            stagesTitle.textContent = `HSK ${this.currentLevel} - Quiz Stages`;
        }

        this.renderStageCards();
        this.showModal('stages-modal');
    }

    renderStageCards() {
        const grid = document.getElementById('stages-grid');
        if (!grid) return;

        const stages = [
            { stage: 1, title: 'Stage 1', description: 'Basic greetings and introductions', progress: 100 },
            { stage: 2, title: 'Stage 2', description: 'Numbers and time', progress: 75 },
            { stage: 3, title: 'Stage 3', description: 'Family and daily activities', progress: 50 },
            { stage: 4, title: 'Stage 4', description: 'Food and shopping', progress: 0 }
        ];

        grid.innerHTML = stages.map(stageData => `
            <div class="stage-card${stageData.progress === 0 ? ' locked' : ''}" data-stage="${stageData.stage}">
                <div class="stage-icon">${stageData.progress === 100 ? '🏆' : stageData.progress > 0 ? '⭐' : '🔒'}</div>
                <div class="stage-title">${stageData.title}</div>
                <div class="stage-description">${stageData.description}</div>
                <div class="stage-progress">
                    <div class="stage-progress-bar" style="width: ${stageData.progress}%"></div>
                </div>
            </div>
        `).join('');

        // Add click listeners to stage cards
        grid.querySelectorAll('.stage-card:not(.locked)').forEach(card => {
            card.addEventListener('click', (e) => {
                const stage = parseInt(card.dataset.stage);
                this.startQuiz(stage);
            });
        });
    }

    async startQuiz(stage) {
        this.currentStage = stage;
        this.hideModal('stages-modal');
        
        // Start the quiz using the existing system
        await this.multipleChoiceExercise.display(this.currentLevel, this.currentStage);
    }

    renderWordCards(words) {
        const grid = document.getElementById('words-grid');
        if (!grid) return;

        grid.innerHTML = words.map(word => `
            <div class="word-card" data-word-id="${word.id}">
                <div class="word-hanzi">${word.hanzi}</div>
                <div class="word-pinyin">${word.pinyin}</div>
                <div class="word-translation">${word.translation}</div>
            </div>
        `).join('');

        // Add click listeners to word cards
        grid.querySelectorAll('.word-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const wordId = card.dataset.wordId;
                const word = words.find(w => w.id === wordId);
                this.showWordDetail(word);
            });
        });
    }

    showWordDetail(word) {
        const detailBody = document.getElementById('word-detail-body');
        if (!detailBody) return;

        detailBody.innerHTML = `
            <div class="detail-hanzi">${word.hanzi}</div>
            <div class="detail-pinyin">${word.pinyin}</div>
            <div class="detail-translation">${word.translation}</div>
            <div class="detail-definition">${word.definition}</div>
            <div class="detail-example">${word.example}</div>
        `;

        this.showModal('word-detail-modal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        
        if (modal && overlay) {
            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');
            
            // Trigger animation
            requestAnimationFrame(() => {
                overlay.classList.add('visible');
                modal.classList.add('visible');
            });
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('overlay');
        
        if (modal) {
            modal.classList.remove('visible');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                // Only hide overlay if no other modals are visible
                if (!document.querySelector('.words-modal.visible, .category-modal.visible, .word-detail-modal.visible, .stages-modal.visible')) {
                    overlay?.classList.remove('visible');
                    setTimeout(() => overlay?.classList.add('hidden'), 300);
                }
            }, 400);
        }
    }

    hideAllModals() {
        const modals = ['category-modal', 'words-modal', 'word-detail-modal', 'stages-modal'];
        const overlay = document.getElementById('overlay');
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('visible');
                setTimeout(() => modal.classList.add('hidden'), 400);
            }
        });
        
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    // Legacy methods for quiz system
    async startStage(levelNum, stageNum) {
        console.log(`Starting stage ${stageNum} of level ${levelNum}`);
        this.currentLevel = levelNum;
        this.currentStage = stageNum;

        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        if (overlay) {
            overlay.classList.remove('hidden');
            void overlay.offsetWidth;
            overlay.classList.add('visible');
        }
        
        if (title) title.classList.add('minimized');
        if (content) {
            content.classList.remove('hidden');
            setTimeout(() => {
                content.classList.add('visible');
            }, 50);
        }
        
        await this.multipleChoiceExercise.display(this.currentLevel, this.currentStage);
    }

    closeContent() {
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        if (content) {
            content.classList.remove('visible');
            if (overlay) {
                overlay.classList.remove('visible');
            }
            setTimeout(() => {
                content.classList.add('hidden');
                if (overlay) overlay.classList.add('hidden');
                document.querySelector('.course-title')?.classList.remove('minimized');
            }, 500);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CourseDisplay');
    window.courseDisplay = new CourseDisplay();
});