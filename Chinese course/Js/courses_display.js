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
        // Level tab listeners
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const levelNum = parseInt(e.target.dataset.level);
                this.switchLevel(levelNum);
            });
        });

        // Stage circle listeners
        document.querySelectorAll('.stage-circle:not(.locked)').forEach(circle => {
            circle.addEventListener('click', (e) => {
                const level = parseInt(circle.getAttribute('data-level'));
                const stage = parseInt(circle.getAttribute('data-stage'));
                this.showCategorySelection(level, stage);
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

    switchLevel(level) {
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`.level-tab[data-level="${level}"]`).classList.add('active');
        
        document.querySelectorAll('.path-section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(`level-${level}-path`)?.classList.remove('hidden');
    }

    async showCategorySelection(level, stage) {
        this.currentLevel = level;
        this.currentStage = stage;

        try {
            const response = await fetch(`../Json/HSK${level}/stage${stage}/categories.json`);
            const data = await response.json();
            
            this.renderCategories(data.categories);
            this.showModal('category-modal');
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback with default categories
            this.renderCategories([
                { id: 'words', name: 'Words', description: 'Learn new vocabulary', icon: '📚' },
                { id: 'quiz', name: 'Quiz', description: 'Test your knowledge', icon: '🧠' }
            ]);
            this.showModal('category-modal');
        }
    }

    renderCategories(categories) {
        const grid = document.getElementById('category-grid');
        if (!grid) return;

        grid.innerHTML = categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <span class="category-icon">${category.icon}</span>
                <div class="category-name">${category.name}</div>
                <div class="category-description">${category.description}</div>
            </div>
        `).join('');

        // Add click listeners to category cards
        grid.querySelectorAll('.category-card').forEach(card => {
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
            await this.showWordsMode();
        } else if (categoryId === 'quiz') {
            await this.showQuizMode();
        }
    }

    async showWordsMode() {
        try {
            const response = await fetch(`../Json/HSK${this.currentLevel}/stage${this.currentStage}/words.json`);
            const data = await response.json();
            
            this.renderWordCards(data.words);
            this.showModal('words-modal');
        } catch (error) {
            console.error('Error loading words:', error);
            alert('Failed to load vocabulary data');
        }
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

    async showQuizMode() {
        this.hideAllModals();
        // Legacy support - use old lesson content system for quiz
        await this.multipleChoiceExercise.display(this.currentLevel, this.currentStage);
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
                if (!document.querySelector('.words-modal.visible, .category-modal.visible, .word-detail-modal.visible')) {
                    overlay?.classList.remove('visible');
                    setTimeout(() => overlay?.classList.add('hidden'), 300);
                }
            }, 400);
        }
    }

    hideAllModals() {
        const modals = ['category-modal', 'words-modal', 'word-detail-modal'];
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

    // Legacy methods for old exercise system
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
        
        await this.vocabularyExercise.display(this.currentLevel, this.currentStage);
    }

    async nextExercise() {
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