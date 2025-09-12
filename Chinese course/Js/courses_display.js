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
        document.querySelectorAll('.level-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const levelNum = parseInt(e.currentTarget.dataset.level);
                this.showCategorySelection(levelNum);
            });
        });

        this.setupModalListeners();
    }

    setupModalListeners() {
        document.getElementById('close-category')?.addEventListener('click', () => {
            this.hideModal('category-modal');
        });

        document.getElementById('close-words')?.addEventListener('click', () => {
            this.hideModal('words-modal');
        });

        document.getElementById('close-stages')?.addEventListener('click', () => {
            this.hideModal('stages-modal');
        });

        document.getElementById('close-word-detail')?.addEventListener('click', () => {
            this.hideModal('word-detail-modal');
        });

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
        this.setupCategoryListeners();
        this.showModal('category-modal');
    }

    setupCategoryListeners() {
        document.querySelectorAll('.category-card').forEach(card => {
            card.replaceWith(card.cloneNode(true));
        });

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
            const response = await fetch(`../Json/HSK${this.currentLevel}/words.json`);
            if (!response.ok) throw new Error('Failed to load words data');
            const data = await response.json();
            const allWords = [];
            Object.values(data.stages).forEach(stageWords => {
                allWords.push(...stageWords);
            });

            // Update title
            const wordsTitle = document.getElementById('words-title');
            if (wordsTitle) {
                wordsTitle.textContent = `HSK ${this.currentLevel} - Vocabulary (${allWords.length} words)`;
            }

            this.renderWordCards(allWords);
            this.showModal('words-modal');
        } catch (error) {
            console.error('Error loading words:', error);
            alert('Failed to load vocabulary data: ' + error.message);
        }
    }
        async loadLevelData(level) {
        try {
            const wordsResponse = await fetch(`../Json/HSK${level}/words.json`);
            if (wordsResponse.ok) {
                this.levelWordsData = await wordsResponse.json();
                console.log('Words data loaded:', this.levelWordsData);
            }
            const quizResponse = await fetch(`../Json/HSK${level}/multiple_choices.json`);
            if (quizResponse.ok) {
                this.levelQuizData = await quizResponse.json();
                console.log('Quiz data loaded:', this.levelQuizData);
            }
            if (!this.levelWordsData && !this.levelQuizData) {
                throw new Error('No data files found');
            }
        } catch (error) {
            console.error('Error loading level data:', error);
            throw error;
        }
    }

    async showQuizStages() {
        try {
            const response = await fetch(`../Json/HSK${this.currentLevel}/multiple_choices.json`);
            if (!response.ok) throw new Error('Failed to load quiz data');
            this.levelQuizData = await response.json();
            console.log("Quiz data loaded:", this.levelQuizData);
            const stagesTitle = document.getElementById('stages-title');
            if (stagesTitle) {
                stagesTitle.textContent = `HSK ${this.currentLevel} - Quiz Stages`;
            }

            this.renderStageCards();
            this.showModal('stages-modal');
        } catch (error) {
            console.error('Error loading quiz stages:', error);
            alert('Failed to load quiz data: ' + error.message);
        }
    }

    renderStageCards() {
        const grid = document.getElementById('stages-grid');
        if (!grid || !this.levelQuizData) {
            console.error('Grid not found or quiz data missing');
            return;
        }
        const stages = this.levelQuizData.stages;
        const stageKeys = Object.keys(stages);
        console.log('Rendering stages:', stageKeys);

        if (stageKeys.length === 0) {
            grid.innerHTML = '<p style="color: white; text-align: center;">No exercises available</p>';
            return;
        }

        grid.innerHTML = stageKeys.map((stageKey, index) => {
            const stageData = stages[stageKey];
            const stageNum = index + 1;
            const progress = Math.random() * 100; 

            return `
                <div class="stage-card${progress === 0 ? ' locked' : ''}" data-exercise="${stageNum}" data-exercise-key="${stageKey}">
                    <div class="stage-icon">${progress === 100 ? '🏆' : progress > 0 ? '⭐' : '📝'}</div>
                    <div class="stage-title">Stage ${stageNum}</div>
                    <div class="stage-description">Quiz Stage ${stageNum}</div>
                    <div class="questions-info" style="margin: 10px 0;">
                        <span style="background-color: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8em;">
                            ${stageData.length} Questions
                        </span>
                    </div>
                    <div class="stage-progress">
                        <div class="stage-progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.stage-card:not(.locked)').forEach(card => {
            card.addEventListener('click', (e) => {
                const exerciseKey = card.dataset.exerciseKey;
                console.log('Starting exercise:', exerciseKey);
                this.startQuiz(exerciseKey);
            });
        });
    }



    async startQuiz(exerciseKey) {
        console.log(`Starting quiz for HSK${this.currentLevel} Exercise: ${exerciseKey}`);
        const stageNum = exerciseKey.replace('stage', '');
        this.currentStage = stageNum;
        this.hideModal('stages-modal');
        await this.multipleChoiceExercise.display(this.currentLevel, stageNum);
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
            
            requestAnimationFrame(() => {
                overlay.classList.add('visible');
                modal.classList.add('visible');
            });
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.remove('visible');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                const overlay = document.getElementById('overlay');
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