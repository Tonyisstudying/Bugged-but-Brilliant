import VocabularyTemplate from '../Templates/vocabulary.template.js';

export default class VocabularyExercise {
    constructor() {
        this.currentWord = 0;
        this.words = [];
        this.template = new VocabularyTemplate();
    }

    async display(level = 1, stage = 1) {
        try {
            await this.loadData(level, stage);
            this.displayCurrentWord();
        } catch (error) {
            console.error('Error displaying vocabulary:', error);
            this.showError('Failed to display vocabulary');
        }
    }

    async loadData(level, stage) {
        try {
            const response = await fetch(`../../../Data/Json/courses/chinese/level${level}/stages/stage${stage}/vocab.json`);
            if (!response.ok) throw new Error('Failed to load vocabulary data');
            const data = await response.json();
            this.words = data.words;
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            this.words = [];
            throw error; //re-throw to hanle ni display
        }
    }

    displayCurrentWord() {
        if (!this.words.length) return;
        
        const content = document.getElementById('lesson-content');
        if (!content) return;

        const word = this.words[this.currentWord];
        const html = this.template.render({
            ...word,
            progress: {
                current: this.currentWord + 1,
                total: this.words.length
            }
        });

        content.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const nextBtn = document.querySelector('.next-btn');
        const closeBtn = document.querySelector('.close-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextWord());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    nextWord() {
        if (this.currentWord < this.words.length - 1) {
            this.currentWord++;
            this.displayCurrentWord();
        } else {
            // Move to next exercise type
            this.complete();
        }
    }

    close() {
        const content = document.getElementById('lesson-content');
        content.classList.add('hidden');
        document.querySelector('.course-title').classList.remove('minimized');
    }

    complete() {
        // Handle completion - can be customized based on needs
        console.log('Vocabulary section completed');
    }
}